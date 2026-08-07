# CLAUDE.md — S V CABS (svcabs.net)

> Working conventions and directives for any Claude Code session on this repo.
> Read this in full before editing pages. This file is the source of truth for
> **positioning, conversion rules, and page specs.** When a request conflicts
> with a rule here, flag it before proceeding.

---

## 0. What this project is

Static HTML marketing site for **S V CABS**, a Chennai corporate ground-transport
business operating **since 2000**. Asset-light model (one owned vehicle + attached
partner operators). Booking runs through **WhatsApp** (`+91 9444141019`).

**Primary business goal:** close corporate/employee-transport contracts.
The B2C airport/local track is secondary and must never crowd out the B2B message.

---

## 1. Strategic direction (READ FIRST — this drives every decision)

The site is being **re-skewed toward B2B / corporate rentals.** The default lens for
any change is: *"Does this help a corporate transport decision-maker (IT/BPO ops
manager, admin/HR head, facilities lead) trust us and start a conversation?"*

Our one unfair advantage that Ola/Uber/aggregators **cannot** copy:
- **25+ years of continuous corporate & employee transportation since 2000.**
- Named, accountable humans — not an app.
- Documented operating history (GST, permits, invoices).

**Do not** let the site compete on "safe, reliable, comfortable rides." That is
table stakes and the exact ground where the apps win. Lead with longevity,
accountability, and corporate track record.

---

## 2. Non-negotiable principles

These come from real business history. Do not violate them, even if asked to for
short-term polish.

1. **No unverifiable claims.** Every stat and testimonial must be attributable and
   real. Round marketing numbers with no source (e.g. a bare "98% satisfaction")
   are banned — they *lower* trust with B2B buyers. If we can't back it, cut it.
2. **Show price signals.** Never publish a page that promises "fixed/transparent
   fares" while showing zero numbers. At minimum show indicative "from ₹X" ranges
   or per-km / per-package rates. Silence on price is a conversion leak.
3. **Split B2B and B2C funnels.** Consumer booking and corporate enquiries are
   different intents with different CTAs and different destinations. Never route a
   corporate buyer into the same consumer WhatsApp "book a cab" thread.
4. **Keep supply-side CTAs off primary conversion paths.** "Drive With Us" and
   "Partner With Us" (fleet recruitment) belong in the footer or a separate page —
   never competing with the booking/enquiry CTA above the fold.
5. **Client names require consent.** Only display a client's name/logo with
   permission. Without permission, use an anonymized descriptor (see §6.3).
6. **Brand string discipline.** Always pair the brand with the city in titles,
   schema, and NAP: **"S V CABS, Chennai"**. This is how we own our search identity
   and separate from the same-name Bangalore operator. Never let a page imply we
   are the Bangalore company.
7. **NAP consistency.** Name / Address / Phone must be byte-identical everywhere
   (site, schema, GBP, footer): `S V CABS · Adyar, Chennai 600020 · +91 44 2445 1902`.

---

## 3. Tech + repo constraints

- **Static HTML.** No build step, no framework.
- **No shared external CSS.** Style blocks are copy-pasted per page. **Any change to
  a shared component (nav, footer, buttons, testimonial card, section styles) MUST
  be applied to every page in the same commit.** List the files you touched.
- Pages: `index.html`, `local-rides.html`, `outstation-cabs-chennai.html`,
  `chennai-airport-taxi.html`, `corporate-car-rental-chennai.html`,
  `wedding-event-car-rental-chennai.html`, `hourly-car-rental-chennai.html`,
  `partner-form.html`, `driver-form.html`.
- Assets under `/assets/images/`. Use **WebP** where possible; keep PNG fallbacks
  only if already referenced.
- JSON-LD structured data lives inline per page. Keep it valid and consistent with
  the visible content (don't schema a fare you don't display).
- Booking = WhatsApp deep links with service-specific prefilled text. Keep the
  prefill accurate to the page.

### 3.1 Updating fares — read before touching any price

**`assets/data/fares.json` is the single source of truth for every rate on the site.**

```
edit assets/data/fares.json  →  node tools/build-fares.mjs  →  commit both together
```

- **Never hand-edit HTML between `<!-- FARES:START/END -->` or `<!-- FARES-LD:START/END -->`.**
  Those regions are overwritten on every run. Everything outside them is yours.
- `node tools/build-fares.mjs --check` exits non-zero if any page is out of sync with
  the JSON. Run it before committing; it catches "edited the JSON, forgot to rebuild."
- The generator is a hand-run maintenance utility, **not** a build step. The site still
  serves as plain static HTML with no toolchain — generated output is committed.
- Conventions that keep §10 honest:
  - `"status": "pending"` → renders a dashed card with a quote CTA and **no numbers**.
    Use this for any vehicle whose rate you don't have. The generator warns by name on
    every run so it can't be quietly forgotten.
  - A `null` rate field → renders "On request". Never guess a missing figure.
  - `"cta": "corporate"` → routes to the proposal-request prefill, never consumer booking.
- Mini bus, weddings and corporate are **quote-only by design**. Their rates may sit in
  the JSON for reference, but the generator never renders them as prices.
- Which vehicles appear on which page is the `pages` block in the JSON — not the HTML.

---

## 4. Global CRO fixes (apply across the whole site)

Work through these as a checklist. Each has a definition of done.

- [ ] **Rewrite the hero to lead with the corporate moat.**
  Replace generic "Safe, Reliable & Comfortable Rides" with a longevity + corporate
  line. Target H1 direction:
  *"Chennai's corporate transport partner since 2000."*
  Subhead carries: 25+ years, 50,000+ trips, employee shuttles / airport / outstation.
  Done when the H1 states *who we're for* and *why us*, not just *what we do*.

- [x] **Add indicative pricing.** Every fare/vehicle table must show a "from ₹X" or
  per-km / per-package figure, with "final fare confirmed on WhatsApp" as the close.
  Done when no page promises "fixed fares" while showing none.
  *Done — see §3.1. Rates live in `assets/data/fares.json`; `tariff.html` plus the
  hourly / local / outstation / airport pages render fare cards from it.*

- [ ] **Attribute or delete every testimonial.** Minimum attribution: first name +
  neighbourhood ("Priya, Velachery"); for corporate quotes, role + firm (with
  consent, else anonymized descriptor). Delete anonymous filler quotes.
  Done when zero unattributed testimonials remain.

- [ ] **Reduce the homepage booking form to ≤3 fields** (name, phone, trip type) that
  prefill a WhatsApp message — or replace with a single WhatsApp button. The 15-field
  form is banned: it adds friction in front of a frictionless channel.

- [ ] **One primary CTA per view.** Remove competing secondary CTAs from the hero
  (e.g. "Our Story"). B2C primary = "Book on WhatsApp". B2B primary = "Request a
  corporate proposal" (see §6).

- [ ] **Move "Partner With Us" / "Drive With Us" to the footer** (or a `careers` /
  `partners` page). Off the primary conversion flow.

- [ ] **Soften over-promises.** "Reply within 30 minutes" → "usually within the hour."
  Only promise SLAs we reliably hit; a broken first-touch promise is fatal for B2B.

- [ ] **Embed real Google rating** instead of hiding it; if the public rating is thin,
  prioritise collecting reviews rather than concealing — but never fabricate.

---

## 5. Homepage (`index.html`) spec

Section order, corporate-forward:

1. **Hero** — corporate-first H1 (see §4), single primary CTA, one trust strip
   (Since 2000 · 50,000+ trips · GST-registered).
2. **Corporate proof band** — client logos OR anonymized client descriptors +
   a single link: **"See our corporate service →"** → `corporate-car-rental-chennai.html`.
   This band appears *above* the multi-service grid.
3. **Services grid** — corporate listed first, then airport/outstation/local/events/hourly.
4. **Why S V CABS** — longevity, accountability, verified drivers, billing you can
   audit, backup vehicles. Frame against "an app can't do this."
5. **Attributed testimonials** (mix at least one corporate).
6. **Fleet.**
7. **Contact** — split: consumer "Book on WhatsApp" + corporate "Request a proposal."
8. **Footer** — supply-side CTAs, NAP, services, socials.

---

## 6. Dedicated Corporate page (`corporate-car-rental-chennai.html`) — PRIORITY BUILD

This is the flagship page for the B2B pivot. Build it to convert an ops/admin/HR
decision-maker, not a one-off rider.

### 6.1 Page structure (in order)

1. **Hero** — H1 e.g. *"Employee & corporate transport in Chennai — trusted since 2000."*
   Subhead: shift-worker transport, airport transfers, office shuttles, event logistics,
   billed monthly on terms. Primary CTA: **"Request a corporate proposal."**
   Secondary: "Talk to us on WhatsApp."
2. **Client proof section** (see §6.3) — logos / named clients / anonymized descriptors.
   Put this high; it is the single most persuasive block on the page.
3. **What corporate clients get** — the operational promises that matter to B2B:
   - Dedicated account manager (a named human, one point of contact).
   - Verified, background-checked drivers; consistent driver allocation.
   - Backup vehicle guarantee for no-shows (asset-light network = coverage).
   - Monthly consolidated invoicing on agreed credit terms; GST invoices.
   - Trip-level records — every invoice traces to logged trips (no guesswork billing).
   - SLA on punctuality and pickup windows for shift transport.
4. **Use cases** — shift-worker pickup/drop, airport transfers for staff/visitors,
   office shuttle routes, event & conference logistics, out-of-town client movement.
5. **How onboarding works** — lead with a **pilot** (see §6.4).
6. **Corporate FAQ** — billing terms, coverage areas, fleet mix, driver verification,
   contract flexibility, GST/compliance.
7. **Corporate CTA block** — proposal request form (see §6.5).

### 6.2 Copy tone

Professional, concrete, procurement-friendly. No hype. Emphasise: continuity (25
years), accountability, clean billing, compliance (GST-registered since [year]).
Always **"S V CABS, Chennai."**

### 6.3 Client proof section — RULES

The user specifically wants past & current clients highlighted here. Do it credibly
and lawfully:

- **Only display a client's name or logo with explicit permission.** Get a yes before
  publishing. When unsure, don't publish the name.
- **Without permission, use anonymized descriptors** that still convey scale and
  sector, e.g.:
  - *"A 400-seat BPO on OMR — daily two-shift employee transport since 2019."*
  - *"A Chennai manufacturing unit — plant shuttle, 3 routes, 6 years running."*
- Prefer **"Current clients" and "Past clients we've served"** as two clear groupings,
  or a single **"Trusted by teams across Chennai IT, BPO & manufacturing"** logo wall.
- Where possible pair one client with a **one-line result** (e.g. "zero missed shift
  pickups across X months") — but only if true and verifiable.
- Leave a clearly-marked `<!-- TODO: replace with real client logos/names once consent
  obtained -->` placeholder block if assets aren't ready; do NOT invent logos.
- Logos: grayscale, uniform height, WebP, in `/assets/images/clients/`.

### 6.4 Onboarding = pilot-first (land-and-expand)

The primary close for corporate is a **short pilot / trial week**, not a cold contract.
Copy should invite: *"Start with a one-week pilot on one route — see the service before
you commit."* This lowers the buyer's risk and is our main conversion mechanism.

### 6.5 Corporate lead capture

Do **not** dump corporate buyers into the consumer WhatsApp booking flow. Corporate CTA
options, in order of preference:
1. A short proposal-request form (Company, Contact name, Role, Phone/email, Approx.
   headcount / routes, Requirement) → submits to our corporate inbox.
2. A dedicated WhatsApp prefill: *"Hi, I'd like a corporate transport proposal for
   [company]."*
3. Link to a one-page company profile PDF (when available) for procurement.

Keep the form short. Every extra field costs a lead.

---

## 7. Trust-signal rules (site-wide)

- Testimonials: **attributed and real**, or removed.
- Stats: only publish what we can defend. Prefer concrete, checkable figures
  ("operating since 2000", "GST-registered") over vibe metrics.
- Show GST registration and years-in-business as credibility anchors on corporate
  surfaces.
- Client logos/names: consent-gated (§6.3).
- No stock-photo "happy customers" passed off as ours.

---

## 8. CTA rules

- **B2C primary:** "Book on WhatsApp" (single button, accurate prefill).
- **B2B primary:** "Request a corporate proposal."
- One primary CTA per viewport. Secondary CTAs must be visually subordinate.
- Supply-side CTAs (driver/fleet) never share space with a primary demand CTA.

---

## 9. Definition of done (checklist for any PR/session)

- [ ] Corporate message is not buried; B2B intent is served above the fold where relevant.
- [ ] No page promises fixed fares without showing indicative price signals.
- [ ] No unattributed testimonials or unverifiable stats introduced.
- [ ] B2B and B2C CTAs are distinct and route to distinct destinations.
- [ ] Shared components (nav/footer/styles) updated across ALL pages in the same commit.
- [ ] NAP identical to §2.7; brand rendered as "S V CABS, Chennai".
- [ ] JSON-LD matches visible content; no schema for prices/claims not shown.
- [ ] No invented client logos/names; consent TODOs left where assets are pending.
- [ ] Files changed are listed in the summary.

---

## 10. Do NOT

- Do not invent clients, logos, reviews, or statistics.
- Do not publish a client name without confirmed consent.
- Do not re-introduce the 15-field homepage booking form.
- Do not compete on "reliable/comfortable rides" in headlines.
- Do not edit a shared style block on one page only.
- Do not imply any association with the Bangalore "SV Cabs".
- Do not add advance-payment gates; billing/terms are handled in conversation for B2B.