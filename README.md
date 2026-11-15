# ShareText

ShareText is a self-hosted web app for saving and sharing text across devices. It includes account management, automatic backups, live updates, and installable progressive web app (PWA) support.

## Features

- Sign up, verify an email address, and sign in.
- Create, edit, copy, pin, mark important, hide, and delete saved text.
- Automatically back up text; backups expire after approximately 24 hours.
- Receive live text updates through a server-sent events connection.
- Reset a forgotten password or change it from the account page.
- Submit support messages from the Contact Us page.
- Install the PWA from a supported browser's address bar or settings menu. Newly verified accounts receive a pinned install reminder.
- Delete an account and its saved text and backups after confirming the request by email.

## Requirements

- Node.js and npm
- MongoDB with replica-set support (account deletion uses a transaction)
- An SMTP account for verification, password-reset, and account-deletion emails

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root. For example:

   ```dotenv
   Environment=development
   PORT=8000
   DB_NAME=sharetext
   SESSION_SECRET=replace-with-a-long-random-secret
   SECRET=replace-with-a-different-long-random-secret
   HOST=smtp.example.com
   USER=mailer@example.com
   PASS=replace-with-your-smtp-password
   SUPPORT=support@example.com
   ```

   `SESSION_SECRET` signs session cookies. `SECRET` signs email-verification, password-reset, and account-deletion tokens. Use different, unpredictable values and keep `.env` private; it is ignored by Git.

3. Start the local MongoDB replica set expected by `src/config/dbConnect.js`. In development, the app connects to `127.0.0.1:27017` and `127.0.0.1:27018` as replica set `rs0`. Set `DB_NAME` to the database to use.

4. Start the server:

   ```sh
   npm start
   ```

   The server listens on `PORT`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `Environment` | Set to `development` locally or `production` for production settings. |
| `PORT` | Port the Express server listens on. |
| `DB_NAME` | MongoDB database name. |
| `MONGO_URI` | MongoDB connection string used when `Environment=production`. |
| `SESSION_SECRET` | Secret used by `express-session`. |
| `SECRET` | JWT signing secret for verification and account email links. |
| `HOST` | SMTP server hostname. |
| `USER` | SMTP username and sender address. |
| `PASS` | SMTP password or app password. |
| `SUPPORT` | Optional support address shown on the Contact Us page. |

Email is sent over secure SMTP on port `465`. In production, set `MONGO_URI`, serve the app over HTTPS, and configure the reverse proxy to forward the original host and protocol. Production mode enables secure session cookies and proxy trust.

## Account and email flows

- Email verification and password-reset links expire after 30 minutes.
- Submitting the Delete Account form verifies the account details and sends a 30-minute confirmation link. Opening that link immediately and permanently deletes the account, saved text, and backups.
- Because the deletion link performs the action when opened, automated email security scanners that follow links may also trigger deletion.

## Project layout

```text
app.js                  Express routes and server startup
models/                 Mongoose models for users, text, backups, and blocklists
src/config/              Database and session-store configuration
src/middlewares/         Express middleware
src/helpers/             Shared helpers
src/utils/               Background and utility code
views/                   EJS pages and partials
public/                  CSS, browser JavaScript, images, and PWA assets
```

Contact form submissions are stored in `contactdata.json`, so the server needs write access to that file.
