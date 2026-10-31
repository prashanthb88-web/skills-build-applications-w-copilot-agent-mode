# OctoFit Tracker frontend

The presentation tier uses React 19, Vite, React Router, and Bootstrap. Start it
with `npm run dev` from this directory, or run `npm run dev --prefix
octofit-tracker/frontend` from the repository root.

## API configuration

In Codespaces, define `VITE_CODESPACE_NAME` in `.env.local` before starting
Vite. For example:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The value is the Codespace name, not a URL. Vite uses it to send API requests to
`https://<name>-8000.app.github.dev`. Vite environment variables are read at
startup, so restart the development server after changing `.env.local`.

For local development, `VITE_CODESPACE_NAME` may be left unset; the frontend
then uses `http://localhost:8000`.
