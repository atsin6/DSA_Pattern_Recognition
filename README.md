# DSA Pattern Recognition

This project is my personal DSA pattern handbook built as an interactive web app.
I wanted one place where I could quickly map a problem to the right pattern, compare approaches, and jump into practice questions.

I vibecoded it.

## What this is

- A pattern recognition guide for coding interviews and problem-solving.
- Split into topic areas like Array/String, Recursion/DP, Trees/Graphs, and advanced patterns.
- Includes framework-style views (`Pattern Map`, `Decision Framework`, `Cross-Pattern Comparison`) for quick direction.
- Problem tables include difficulty + key idea, and each problem links out to LeetCode.
- Comes with a light/dark theme toggle.

## Tech stack

- React
- Vite
- CSS (with a legacy-content rendering layer + custom UI polish)

## Project structure

- `src/App.jsx` — app behavior and UI layer (theme, navbar tabs, search/table normalization).
- `src/main.jsx` — React bootstrap.
- `public/legacy-content.html` — source knowledge content rendered inside the app.
- `index.html` — Vite root HTML.

## License

Personal/project use.
