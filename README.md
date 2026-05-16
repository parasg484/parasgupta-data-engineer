# Paras Gupta Portfolio

Static portfolio site built from the resume content in `Paras_Gupta_Resume_DE_15May.pdf`.

## Files

- `index.html` - portfolio content and page structure
- `styles.css` - responsive styling
- `app.js` - local blog publishing, import, and export
- `posts.json` - public blog posts loaded by the site
- `assets/data-flow.svg` - data engineering visual
- `assets/Paras_Gupta_Resume_DE_15May.pdf` - hosted resume PDF

## Run Locally

Open `index.html` directly in a browser, or serve the folder:

```powershell
& "C:\Users\CND44\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 4173
```

## Host on GitHub Pages

1. Create a new public GitHub repository named `paras-gupta-portfolio`.
2. Upload all files from this folder.
3. In GitHub, go to `Settings > Pages`.
4. Set source to `Deploy from a branch`, choose `main`, and select `/root`.
5. Use the generated GitHub Pages URL in your resume.

## Blog Publishing

The site loads public posts from `posts.json`. The in-page editor saves posts and optional PDF attachments in browser local storage for quick drafting. Use `Export` after writing posts, then replace `posts.json` with that exported JSON before redeploying so everyone can see the new posts and attachments.
