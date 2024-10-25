
### Testing locally

To test the application locally, run
1. Ensure that `start_url` in `manifest.json` is `index.html` not `/CloudNotes/index.html`
1. Run `npx serve .`
1. Load from browser

### Deploying to Github

Make sure that `start_url` in `manifest.json` is `/CloudNotes/index.html` not `index.html`