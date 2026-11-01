# Doggy Kizz: official website

React + Vite site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```
npm ci
npm run dev        # local preview
npm run build      # production build into dist/
```

## Where things live

| To change… | Edit |
|---|---|
| Name, bio, genres, social links, WhatsApp number, news posts | `src/data/siteContent.js` |
| Songs and YouTube links | `src/data/catalog.js` |
| Photos | `public/images/` (see `public/images/README.txt`) |
| Colours | the tokens at the top of `src/styles.css` (accent is gold) |
| Admin board, newsletter, Firebase | `ADMIN-SETUP.md` |

## Before launch checklist

- [ ] Replace the placeholder biography and confirm the genres and location line in `siteContent.js`.
- [ ] Add his approved photos to `public/images/`.
- [ ] Follow `ADMIN-SETUP.md` (his own Firebase project, rules, admin account, GitHub Actions variables).
- [ ] Confirm the TikTok username and the WhatsApp number with him.
- [ ] Collect the rest of his catalogue (only 48 of 504 YouTube uploads are included so far).
