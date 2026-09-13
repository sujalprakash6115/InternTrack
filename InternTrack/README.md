# InternTrack — Frontend Only

A complete job & internship application tracker that runs entirely in the browser.

**No backend required.** All data is stored in your browser's localStorage.

## Features

- ✅ Register & Login (local accounts)
- ✅ Application CRUD (add, edit, delete, search, filter by status)
- ✅ Status pipeline: SAVED → APPLIED → INTERVIEW → SELECTED / REJECTED
- ✅ Schedule interviews linked to applications
- ✅ Reminders (create, complete, delete)
- ✅ Analytics dashboard with charts (Recharts)
- ✅ Responsive UI (desktop + mobile)
- ✅ Modern SaaS-style design with Tailwind CSS

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Recharts
- Lucide React icons
- localStorage (data persistence)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173**

## How to use

1. Register a new account
2. Add job/internship applications
3. Update status, schedule interviews, set reminders
4. View analytics on the Dashboard & Analytics pages

## Data storage

Everything is saved in the browser:

| Key | Content |
|-----|---------|
| `interntrack_users` | Registered users |
| `interntrack_current_user` | Logged-in user |
| `interntrack_applications` | Applications |
| `interntrack_interviews` | Interviews |
| `interntrack_reminders` | Reminders |

Clearing browser data will reset the app.

## Build for production

```bash
npm run build
```

Output goes to the `dist/` folder. You can deploy it to Vercel, Netlify, GitHub Pages, etc.

## Project structure

```
src/
├── context/          # Auth context
├── layouts/          # Dashboard sidebar layout
├── pages/            # All screens
├── services/
│   └── storage.js    # localStorage data layer
├── App.jsx
├── main.jsx
└── index.css
```

## License

MIT — free for learning and portfolio projects.
