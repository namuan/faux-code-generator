# Faux Code Generator

Turn real code into faux code. Paste a GitHub Gist URL and get back a clean SVG illustration — no identifiable syntax, just the visual shape of code.

![Faux Code Generator](public/thumbnail.png)

## How it works

1. Paste a GitHub Gist URL
2. Choose a theme (light or dark) and line end style (rounded or squared)
3. Click **Create Faux Code**
4. Download the generated SVG

## Development

**Requirements:** Node.js

```bash
npm install
npm run dev
```

Opens a local dev server at `http://localhost:1234`.

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Stack

- [Parcel](https://parceljs.org/) — bundler
- [Pug](https://pugjs.org/) — HTML templating
- [Sass](https://sass-lang.com/) — styles
- [highlight.js](https://highlightjs.org/) — client-side syntax highlighting
- [GitHub Gist API](https://docs.github.com/en/rest/gists) — fetches gist content directly from the browser

## Credits

Original project by [@knutsynstad](https://github.com/knutsynstad/faux-code-generator).
