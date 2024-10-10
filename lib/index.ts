import * as abbreviations from "./abbreviations/index.js"
import { cached } from "./util.js"

const makeSegmenter = cached((locale: Intl.LocalesArgument) => ({
	abbreviations: new Set<string>(
		abbreviations[String(locale) as keyof typeof abbreviations] ?? []
	),
	segmenter: new Intl.Segmenter(locale, { granularity: "sentence" }),
}))

/**
 * Split a string into sentences, respecting common abbreviations.
 */
export function* splitBySentence(
	input: string,
	locale: Intl.LocalesArgument = "en"
) {
	if (!input || typeof input !== "string")
		throw new TypeError("input must be a string")

	const { abbreviations, segmenter } = makeSegmenter(locale)
	const rLastWord = /(?<=\s|^)\S+(?=\s+$)/

	let continuationIndex: number | undefined
	let continuation = ""
	for (const { segment, index } of segmenter.segment(input)) {
		const [lastWord] = segment.match(rLastWord) || []

		if (lastWord && abbreviations.has(lastWord.toLocaleLowerCase(locale))) {
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
