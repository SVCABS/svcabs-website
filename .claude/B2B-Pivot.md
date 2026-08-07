# S V CABS — B2B / Corporate / ETS Pivot Plan

> Scope: re-skew the site toward B2B. Add a dedicated Corporate/ETS section to
> `index.html` and rework the existing `corporate-car-rental-chennai.html` to lead
> with Employee Transportation Services. **No new page is created** — the existing
> corporate page is the hub.

---

## Objective

Give Corporate / ETS its own prominent home on `index.html`, and rework the existing
corporate page to lead with Employee Transportation Services + a credible client-proof
section — so a corporate buyer sees a B2B partner, not a consumer taxi site, within the
first two screens.

---

## The three pillars (consistent across index + corporate page)

Frame the corporate offer as three named sub-services so ETS gets equal billing, not
buried under "corporate":

1. **Employee Transportation Services (ETS)** — shift pickup/drop, office shuttles,
   routed daily transport. The recurring-revenue core; run since 2000. **Leads.**
2. **Corporate car rental** — executive travel, client/visitor movement, ad-hoc
   business trips, staff airport transfers.
3. **Events & group logistics** — conferences, offsites, guest movement.

---

## Part A — New B2B section on `index.html`

A dedicated band placed **directly below the hero, above the general 6-service grid**
(the high-value real estate the generic grid currently wastes).

Contents:

- [ ] Heading anchored on the moat: *"Corporate & employee transportation in Chennai —
      since 2000."*
- [ ] Three pillar cards (ETS first) — icon / label / one line each.
- [ ] Compact trust strip: `25+ years · 50,000+ trips · GST-registered · [X] corporate partners`.
- [ ] **One** primary CTA → existing corporate page: "See our corporate service".
      Secondary: "Request a proposal".
- [ ] Pull the Corporate tile **out** of the general services grid (no double listing).
      General grid stays but becomes consumer-only: local, airport, outstation, hourly, events.

**Net effect:** corporate buyers see a B2B site in the first two screens; consumers
still find their path just below.

---

## Part B — Rework the existing corporate page

Keep the URL and file; restructure to lead with ETS and add client proof.

New section order:

1. **Hero** — H1 on ETS + since 2000. Primary CTA "Request a corporate proposal",
   secondary WhatsApp.
2. **Client proof section** (placed high) — current & past clients as logos/names
   *where consent exists*, anonymized descriptors otherwise
   (e.g. *"a 400-seat BPO on OMR, two-shift ETS since 2019"*). This block persuades
   most; competitors lead with named logos, so credible proof here is how we match them.
3. **Three pillars expanded** — ETS first, with the operational promises B2B
   procurement cares about: consistent driver allocation, backup-vehicle guarantee,
   routing, monthly consolidated GST invoicing on terms, trip-level auditable billing.
4. **How onboarding works** — pilot-first (start with one route for a week).
5. **Corporate FAQ** — billing terms, coverage, fleet mix, driver verification, compliance.
6. **Corporate lead capture** — short proposal form OR corporate-specific WhatsApp
   prefill (never the consumer "book a cab" thread).

---

## Sequencing

1. [ ] Build the index B2B band + remove the duplicate corporate tile from the grid.
2. [ ] Rework the corporate page (structure + copy) with `TODO` placeholders for client assets.
3. [ ] Drop in real client logos/names once consent is confirmed.
4. [ ] Wire the proposal form once domain email is live (currently pending); until then
       it routes to the corporate WhatsApp prefill.

> Shared nav/footer edits are applied across all nine pages in the same commit
> (no shared CSS in this repo).

---

## Inputs needed from Vijay

- [ ] **ETS operational specifics** — routed shift transport? cab desk? women's-safety /
      escort norms? GPS / tracking? (Only what's true goes on the page.)
- [ ] **Client list + consent status** — which current/past clients can be named vs. stay
      anonymized. Even 3–5 named logos changes the page.
- [ ] **Confirm scope** — ETS folded into the existing corporate page for now (as instructed)
      vs. a future dedicated `employee-transportation-chennai.html`. Note: real search volume
      exists for "employee transportation Chennai / ETS Chennai," so a split page later would
      rank better. Not doing it now — flagged only.

---

## Acceptance criteria

- [ ] Corporate/ETS is visible within the first two screens of `index.html`.
- [ ] ETS is named and leads the corporate pillars (not buried under "corporate").
- [ ] Corporate tile appears once, not duplicated across band + grid.
- [ ] Corporate page leads with ETS + since-2000 and carries a client-proof section.
- [ ] No invented client logos/names; consent `TODO`s left where assets are pending.
- [ ] B2B CTA ("Request a proposal") is distinct from the consumer "Book on WhatsApp".
- [ ] Shared components updated across all pages; files changed listed in the summary.