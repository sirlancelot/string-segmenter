import { strict as assert } from "node:assert"
import { it } from "node:test"
import { splitBySentence } from "./index.js"

Object.entries({
	English: [
		"en",
		[
			"Dr. John Smith, Jr. gave a lecture.",
			"As of 2.14.2023, the average price of apples is $1.31 per pound!",
			"Hello Mrs. Maple, could you call me back?",
		],
	],
	Spanish: [
		"es",
		[
			"El Sr. Juan Pérez dio una conferencia.",
			"Desde el 14.2.2023, el precio promedio de las manzanas es de $1.31 por libra.",
			"Hola Sra. Maple, ¿podría devolverme la llamada?",
		],
	],
} satisfies {
	[key: string]: [locale: string, corpus: string[]]
}).forEach(([language, [locale, corpus]]) =>
	it(`Splits by sentence (${language})`, () => {
		const sentences = corpus.join(" ")
		const result = []

		for (const { segment, index } of splitBySentence(sentences, locale)) {
			assert.equal(
				segment,
				sentences.slice(index, index + segment.length)
			)
			result.push(segment.trimEnd())
		}

		assert.deepEqual(result, corpus)
	})
)
