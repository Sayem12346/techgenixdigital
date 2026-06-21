# Techgenix Digital — Website + Admin Panel

React + Vite site with a Supabase-powered backend and a hidden `/admin` content management panel.

---

## Part 1 — Supabase Database Setup (do this once)

1. Go to your Supabase project: **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `supabase/schema.sql` from this project, copy the **entire file**, paste it into the SQL Editor
4. Click **Run**

This creates 4 tables (`site_settings`, `services`, `testimonials`, `case_studies`), sets up security rules (public can read, only logged-in admin can edit), creates an image storage bucket, and pre-fills it with your current website content.

## Part 2 — Create the Admin Login (do this once)

The admin panel uses Supabase Auth (proper username/password login, not a simple shared password).

1. In Supabase dashboard, go to **Authentication** (left sidebar) → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email:** an email you control (e.g. `admin@techgenixdigital.com` or your real Gmail — it doesn't need to be a working inbox unless you want password reset)
   - **Password:** a strong password
   - Check **Auto Confirm User** (important — skips email verification)
4. Click **Create user**

This email + password is what you'll use to log into `yoursite.com/admin`.

> You can add more admin users later the same way, if other team members need access.

---

## Part 3 — Bangla Deploy Guide (Netlify)

### Step 1: GitHub-e Upload

1. [github.com](https://github.com) e login korun
2. **New repository** banan: `techgenix-digital`, **Public** select kore **Create**
3. Shob file (folder structure thik rekhe) upload korun:
   ```
   index.html
   package.json
   vite.config.js
   .gitignore
   supabase/schema.sql
   public/_redirects
   src/main.jsx
   src/TechgenixDigital.jsx
   src/lib/supabase.js
   src/admin/AdminLogin.jsx
   src/admin/AdminDashboard.jsx
   src/admin/RequireAuth.jsx
   src/admin/ui.js
   src/admin/tabs/SettingsTab.jsx
   src/admin/tabs/ServicesTab.jsx
   src/admin/tabs/TestimonialsTab.jsx
   src/admin/tabs/CaseStudiesTab.jsx
   ```
4. **Commit changes**

### Step 2: Netlify e Deploy

1. [netlify.com](https://netlify.com) e GitHub diye login korun
2. **Add new site** → **Import an existing project** → GitHub → repo select korun
3. Build command: `npm run build`, Publish directory: `dist` (auto-detect hobe)
4. **Deploy site**

2-3 minute e live link pabe.

---

## Part 4 — Using the Admin Panel

1. Browser e jan: `yoursite.netlify.app/admin` (eta kothao link kora nei, direct URL diye jete hobe)
2. Email + password diye login korun (jeta Part 2 e banano hoyeche)
3. Tabs:
   - **Hero & Contact** — headline, subheadline, badge text, phone, WhatsApp, email, address, hours, social links, logo upload
   - **Services** — 8 services add/edit/delete, image upload, features list
   - **Testimonials** — client reviews add/edit/delete
   - **Case Studies** — result metrics (ROI%, growth%, etc.) add/edit/delete
4. Change kore **Save** korle, public website e shathe shathe update hoye jabe (refresh korle dekha jabe)

### Security notes
- Admin panel URL kothao public site e link kora nei — shudhu apni/client jara URL jane tara dhukte parbe
- Login na thakle `/admin/dashboard` e jete dile automatically login page e pathiye dey
- Public website shudhu **read** korte pare database theke — **write/edit** korte hole login lagbe (Row Level Security diye enforced, code-level na, tai eta bypass kora jay na)

---

## Local Testing (optional, needs Node.js installed)

```bash
npm install
npm run dev      # preview at localhost:5173
npm run build    # production build → /dist
```

## Notes

- Service/logo images uploaded via the admin panel go to Supabase Storage (free tier: 1GB) — no more base64 embedding needed for new images.
- The original 8 service images remain embedded in the code as a fallback/default in case the database is empty or unreachable — the site never shows a broken page.
- Testimonials and case-study numbers are pre-filled with placeholder content — edit them via the admin panel with real client results before sharing the site publicly.
- The contact form's "Submit Brief" button still opens WhatsApp with a pre-filled message — no separate backend needed for that.
