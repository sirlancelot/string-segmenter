import { test, beforeEach } from "node:test"
import { clearSegmenterCache, splitBySentence } from "./index.js"

beforeEach(() => clearSegmenterCache())

type Fixture = [
	language: string,
	locale: Intl.LocalesArgument,
	corpus: string[]
]
for (const [language, locale, corpus] of [
	[
		"English",
		"en",
		[
			"Dr. John Smith, Jr. gave a lecture.",
			"As of 2.14.2023, the average price of apples is $1.31 per pound!",
			"There's pool, pinball, Ms. Pac Man, tvs for Football (or playoff baseball!!!!) and they are kid friendly on one half of the bar.",
			// all lowercase
			"i just spoke with michelle at cinergy.",
			"she said she's hearing a rumor that lonestar may be doing more work at the end of the month.",
			"kevin, could you please call jeff or gary to see if the rumor is true.",
			"i'd like to have a \"heads up\" if possible.",

		],
	],
	[
		"Spanish",
		"es",
		[
			"El Sr. Juan Pérez dio una conferencia.",
			"Desde el 14.2.2023, el precio promedio de las manzanas es de $1.31 por libra.",
			"Hola Sra. Maple, ¿podría devolverme la llamada?",
			"El Dr. García está en una reunión.",
		],
	],
] satisfies Fixture[]) {
	test(`Splits by sentence (${language})`, ({ assert }) => {
		const sentences = corpus.join(" ")
		const result = []

		for (const { segment, index } of splitBySentence(sentences, locale)) {
			assert.equal(segment.length > 0, true)
			assert.equal(
				segment,
				sentences.slice(index, index + segment.length)
			)
			result.push(segment.trimEnd())
		}

		assert.deepEqual(result, corpus)
	})
}

test("Throws on invalid input", ({ assert }) => {
	assert.throws(() => [...splitBySentence("")])
	assert.throws(() => [...splitBySentence(undefined as any)])
	assert.throws(() => [...splitBySentence(42 as any)])
})
