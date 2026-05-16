# AGENTS.md

## Cursor Cloud specific instructions

This is a static portfolio website (HTML/CSS/JS) with no build step, no package manager, and no dependencies to install.

### Running the dev server

Serve the site locally with Python's built-in HTTP server on port 5501 (matching `.vscode/settings.json` Live Server config):

```
python3 -m http.server 5501 --directory /workspace
```

Then open `http://localhost:5501/` in Chrome.

### Project structure

- `index.html` — single-page portfolio (all content)
- `style.css` — all styles
- `script.js` — client-side JS (animations, dark mode toggle, contact form)
- `assets/` — fonts and images
- `img/` — profile/headshot images
- `_private/script.gs` — Google Apps Script backend for the contact form (deployed externally, not run locally)

### Key notes

- There is **no `package.json`**, no npm/yarn/pnpm, no build tools, no test framework, and no linter configured in this repo.
- CDN-loaded libraries (jQuery, Typed.js, Font Awesome) require internet access for full functionality.
- The contact form submits to an external Google Apps Script endpoint and uses reCAPTCHA v3; form submission cannot be tested locally without those external services.
- Google Analytics is loaded but non-functional in local dev (expected).
