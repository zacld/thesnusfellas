# Launch Guide — The Snus Fellas

## Step 1: GitHub

```bash
cd "/Users/zacharydevine/Desktop/Snus fellas"
git init
git add .
git commit -m "Initial build"
gh repo create thesnusfellas --public --source=. --push
```

Or push to an existing repo:
```bash
git remote add origin https://github.com/YOUR_USERNAME/thesnusfellas.git
git push -u origin main
```

---

## Step 2: Netlify

1. Go to netlify.com → Add new site → Import from Git
2. Connect your GitHub repo
3. Build settings:
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
   - Build command: *(leave blank)*
4. Environment variables (Site settings → Environment variables):
   - `STRIPE_SECRET_KEY` = `sk_live_...` ← your live secret key
   - `URL` = `https://thesnusfellas.co.uk`
5. Deploy

---

## Step 3: Domain

1. Netlify → Domain management → Add custom domain → `thesnusfellas.co.uk`
2. Copy the 4 Netlify nameservers shown
3. Go to your domain registrar → update nameservers to Netlify's
4. SSL provisions automatically within ~1 hour

---

## Step 4: Test

- Use Stripe test card `4242 4242 4242 4242` (any future expiry, any CVC)
- Click any Buy Button on the Bundles page → should open Stripe Checkout
- Complete test purchase → should redirect to `/success`
- Check success page looks correct

---

## Stripe Buy Button IDs

| Price | Buy Button ID |
|---|---|
| £11.99 (Traditional, Swedish, Norway, Widowmaker) | `buy_btn_1TLpNBDDHsuciWtWyG2rUOeb` |
| £19.99 (Fruity, ZYN, VELO, Monthly Drop) | `buy_btn_1TLpOMDDHsuciWtWzA58EFrc` |

---

## Known Gotchas

- Only one `<script>` tag in the HTML — duplicate scripts cause "already declared" errors
- Stripe Buy Buttons render in shadow DOM — don't try to style them beyond `::part(button)`
- The `netlify.toml` handles all redirects — don't add a `_redirects` file as well
- `STRIPE_SECRET_KEY` goes in Netlify env vars only — never in the HTML or JS
