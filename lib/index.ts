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
	input: string,
	locale: Intl.LocalesArgument = "en"
): Generator<Intl.SegmentData> {
	if (!input || typeof input !== "string")
		throw new TypeError("input must be a string")

	const { abbreviations, segmenter } = makeSegmenter(locale.toString())
	const rLastWord = /(?<=\s|^)\S+(?=\s+$)/

	let continuationIndex: number | undefined
	let continuation = ""
	for (const { segment, index } of segmenter.segment(input)) {
		const match = segment.match(rLastWord)

		if (
			match &&
			// 1. The last word is an abbreviation.
			(abbreviations.has(match[0].toLocaleLowerCase(locale)) ||
				// 2. A closing parenthesis without a period.
				match[0].endsWith(")"))
		) {
			continuationIndex = continuationIndex ?? index
			continuation += segment
			continue
		}

		yield {
			segment: continuation + segment,
			index: continuationIndex ?? index,
			input,
		}

		continuation = ""
		continuationIndex = undefined
	}
}

/**
 * Clear the segmenter cache. `splitBySentence` stores an instance of
 * `Intl.Segmenter` for each locale it's called with. Use this function to free
 * up that memory, if needed.
 */
export const clearSegmenterCache = () => void makeSegmenter.clear()
