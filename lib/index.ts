import { cached } from "./util.js"

function fetchAbbreviationsSync(locale: string): string[] {
	try {
		return require(`./abbreviations/${locale}.json`)
	} catch {
		return []
	}
}

const makeSegmenter = cached((locale: string) => ({
	abbreviations: new Set(fetchAbbreviationsSync(locale)),
	segmenter: new Intl.Segmenter(locale, { granularity: "sentence" }),
}))

/**
 * Split a string into sentences, respecting common abbreviations.
 */
export function* splitBySentence(
	rawInput: string,
	locale: Intl.LocalesArgument = "en"
): Generator<Intl.SegmentData> {
	if (!rawInput || typeof rawInput !== "string")
		throw new TypeError("input must be a string")

	const { abbreviations, segmenter } = makeSegmenter(locale.toString())
	const rLastWord = /(?<=\s|^)\S+(?=\s+$)/
	const input = rawInput.replaceAll(/(?<=\.\s+)\S/g, (char) =>
		char.toLocaleUpperCase()
	)

	let left = 0
	for (const { segment, index } of segmenter.segment(input)) {
		const match = segment.match(rLastWord)

		if (
			match &&
			// 1. The last word is an abbreviation.
			(abbreviations.has(match[0].toLocaleLowerCase(locale)) ||
				// 2. A closing parenthesis without a period.
				match[0].endsWith(")"))
		)
			continue

		const right = index + segment.length
		yield {
			segment: rawInput.slice(left, right),
			index: left,
			input: rawInput,
		}

		left = right
	}
}

/**
 * Clear the segmenter cache. `splitBySentence` stores an instance of
 * `Intl.Segmenter` for each locale it's called with. Use this function to free
 * up that memory, if needed.
 */
export const clearSegmenterCache = () => void makeSegmenter.clear()
