# Doggy Kizz website: admin board and Firebase setup

This site has a private admin board at `/admin` where Doggy Kizz (or you) can post news, announcements and
shows, and collect newsletter sign-ups. It runs on **his own Firebase project**. Nothing is shared with any
other artist's site, because the site only talks to the project named in the four `VITE_FIREBASE_*` settings.

The public pages work without Firebase. Until the settings are added, `/admin` shows "Admin is not set up yet".

## 1. Create his Firebase project (once)

1. Go to <https://console.firebase.google.com> and sign in with the Google account that should **own** the
   project (Doggy Kizz's own account is best, or one you both control).
2. **Add project** → name it `doggy-kizz-official` (the ID Google generates is what matters) → Google Analytics is
   optional (you can switch it off).
3. **Build → Firestore Database → Create database**. Choose **Production mode** and a location close to Uganda
   (for example `europe-west1` or `eur3`). The location cannot be changed later.
4. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
5. **Project settings (gear icon) → Your apps → Web app (`</>`)** → register an app called `Doggy Kizz website`
   (no Firebase Hosting needed). Firebase shows a `firebaseConfig` block. Keep that page open for step 3.

## 2. Publish the security rules

The file `firestore.rules` in this project is the protection for his data. Publish it:

- **Easiest (no tools):** Firestore Database → **Rules** tab → delete everything → paste the full contents of
  `firestore.rules` → **Publish**.
- **Or with the Firebase CLI:** `npm i -g firebase-tools`, `firebase login`, copy `.firebaserc.example` to
  `.firebaserc` and put his project ID in it, then `firebase deploy --only firestore:rules`.

What the rules do: visitors can only **read** posts/shows/announcements that are switched on, and can only **add
their own email** to the subscriber list (one document per address, nothing else allowed). Everything else, including
the subscriber list, newsletters and sending, needs an **admin**.

## 3. Add the settings to the website

From the `firebaseConfig` block, copy these four values:

| Setting name | Value in `firebaseConfig` |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_APP_ID` | `appId` |

- **Locally:** copy `.env.example` to `.env`, fill in the four values, run `npm run dev`.
- **On GitHub Pages:** in the repository go to **Settings → Secrets and variables → Actions → Variables tab → New
  repository variable** and add the same four names (not under "Secrets"; the workflow reads **Variables**).
  Then re-run the workflow (Actions → *Build and deploy to GitHub Pages* → Run workflow).

These values are public by design. The rules in step 2 are what keep the data safe.

## 4. Allow the live website address to sign in

Authentication → **Settings → Authorized domains → Add domain**, and add the address the site is published on,
for example `yourname.github.io` (just the domain, no `https://` and no path) and any custom domain later.
Without this, admin sign-in fails on the live site even though it works on `localhost`.

## 5. Create the admin account (the one step that is by hand)

1. In the Firebase console go to **Authentication → Users → Add user** and create
   the admin's email and a strong password.
2. Copy that user's **User UID** from the Users table.
3. **Firestore Database → Data → Start collection** → Collection ID `admins` → Document ID = **the UID you copied**
   → add one field, for example `role` (string) = `admin` → Save.
4. Open `https://<the-site>/admin` and sign in. Add more admins by repeating steps 1-3.

Only a user with a document at `admins/<their UID>` can change anything. Nobody can create that document from the
website (the rules block it), so it can only be done in the Firebase console by the project owner.

## 6. Recommended: restrict the API key

Google Cloud console → APIs & Services → Credentials → open the **Browser key** → *Application restrictions: Websites*
→ add `https://yourname.github.io/*` (and `http://localhost:*` while developing). This stops other sites reusing the key.

## 7. Optional: newsletter sending

Subscribers are collected for free. Sending the emails from the admin board needs the **Trigger Email from Firestore**
extension, which requires upgrading the project to the **Blaze (pay as you go)** plan and an email provider (SMTP).
After installing it, set the Actions variable `VITE_NEWSLETTER_SENDER` to `extension` and re-run the workflow.
Until then the admin board still lets you write and keep drafts, and **Copy emails** / **Download CSV** exports the list.

## Quick check that it all works

1. Open the live site → footer → sign up with a test email → "Thank you, you are subscribed."
2. `/admin` → sign in → **Subscribers** shows that email.
3. Add a News post in the admin board, tick *Published*, and it appears on `/news` within about two minutes.

If the admin list says it "could not load", the rules are not published yet or the account has no `admins/<UID>`
document (steps 2 and 5).
