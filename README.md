# prettier-plugin-css-singleline

![npm](https://img.shields.io/npm/v/prettier-plugin-css-singleline) ![License](https://img.shields.io/badge/license-MIT-green) ![CI](https://github.com/zetafield/prettier-plugin-css-singleline/actions/workflows/ci.yml/badge.svg)  ![Publish](https://github.com/zetafield/prettier-plugin-css-singleline/actions/workflows/publish.yml/badge.svg)

A Prettier plugin that formats single-declaration CSS rules onto one line when they fit within printWidth. This addresses a [long-standing community request](https://github.com/prettier/prettier/issues/5948) from 2019.

<img src="https://raw.githubusercontent.com/zetafield/prettier-plugin-css-singleline/main/.github/assets/GzMH_UpWwAAguyk.jpeg" alt="CSS single-line demo" width="480" />

## Features

- Single-line formatting for rules with exactly one declaration
- Respects printWidth and includes current indentation/nesting in width calculation
- Preserves Prettier's value formatting (no custom value transforms)
- Supports CSS, Less, and SCSS
- Falls back to Prettier's default formatting when conditions are not met

## Install

```bash
pnpm add -D prettier prettier-plugin-css-singleline
# or
npm i -D prettier prettier-plugin-css-singleline
```

## Usage

Example `prettier.config.mjs`:

```js
import postcss from "prettier/plugins/postcss";
import * as singleline from "prettier-plugin-css-singleline";

export default {
  plugins: [postcss, singleline],
  printWidth: 100,
};
```

You can also load the plugin by path during local development:

```js
import postcss from "prettier/plugins/postcss";
import * as singleline from "./index.mjs";

export default {
  plugins: [postcss, singleline],
};
```

## Behavior

- A rule is formatted to a single line if all are true:
  - The rule has exactly one declaration
  - There are no comments inside the rule
  - The resulting single line (including current indentation) is <= printWidth
- Multiple selectors are allowed (e.g. `h1, h2, h3 { margin: 0; }`) as long as the rule still fits
- Value formatting is handled entirely by Prettier; this plugin does not transform values
- Nesting/indentation is considered when checking width, so deeply nested rules must still fit

## Examples

Before:

```css
h1,
h2,
h3 {
  margin: 0;
}
```

After:

```css
h1, h2, h3 { margin: 0; }
```

### Sample input/output

Input (unformatted):

```css
h1,
h2,
h3 {
  margin: 0;
}

.mt1 {
  margin-top: 0.25rem;
}

@media (min-width: 600px) {
  .card {
    margin: 0;
  }
}
```

Output (with this plugin):

```css
h1, h2, h3 { margin: 0; }

.mt1 { margin-top: 0.25rem; }

@media (min-width: 600px) {
  .card { margin: 0; }
}
```

## Testing

Run tests with:

```bash
pnpm test
# or
npm test
```

## Notes

- The plugin extends Prettier's postcss printer, so it applies to CSS, Less, and SCSS automatically.
- No additional configuration options are exposed (yet). If you have a use case, please open an issue.

## Contributing

- Open an issue or PR with a clear description
- Add tests for new behavior (fixtures preferred)
- Ensure `npm test` passes

## License

[MIT](./LICENSE)


