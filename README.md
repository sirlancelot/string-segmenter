# String Segmenter

- Splits strings into sentences.
- Supports multiple languages.
- Respects common abbreviations (Mr., Mrs., Etc.) to avoid incorrect sentence
  splits (English & Spanish only currently).

## Installation

```sh
npm install string-segmenter
```

## Usage

```js
import { splitBySentence } from "string-segmenter"

const text = "Dr. John Smith, Jr. gave a lecture. It was insightful."
const sentences = []

for (const { segment } of splitBySentence(text)) {
	sentences.push(segment.trim())
}

console.log(sentences)
// Output: ["Dr. John Smith, Jr. gave a lecture.", "It was insightful."]
```

## API

### `splitBySentence(input: string, locale: Intl.LocalesArgument = "en"): Iterable<{ segment: string, index: number, input: string }>`

Splits the input string into sentences.

- `input`: The string to be split.
- `locale`: The locale to be used for sentence segmentation. Defaults to "en".

### `clearSegmenterCache(): void`

Clears the cache of `Intl.Segmenter` instances.

## Development

### Building the Project

```sh
npm run build
```

### Running Tests

```sh
npm test # once

npm run dev # run and watch for file changes
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
