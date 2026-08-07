#!/usr/bin/env node
/**
 * build-fares.mjs — renders fare cards + pricing JSON-LD into the static pages
 * from the single source of truth at assets/data/fares.json.
 *
 *   node tools/build-fares.mjs          regenerate and write
 *   node tools/build-fares.mjs --check  exit 1 if anything would change
 *
 * Never hand-edit HTML between the FARES:START/END or FARES-LD:START/END markers;
 * it is overwritten on every run.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'assets', 'data', 'fares.json');
const CHECK = process.argv.includes('--check');

const CARD_START = '<!-- FARES:START -->';
const CARD_END = '<!-- FARES:END -->';
const LD_START = '<!-- FARES-LD:START -->';
const LD_END = '<!-- FARES-LD:END -->';

const problems = [];
const warnings = [];
const fail = (m) => problems.push(m);

/* ── helpers ─────────────────────────────────────────────── */

/** Indian digit grouping (12,34,567) — deterministic, no ICU dependency. */
function inr(n) {
  if (n === null || n === undefined) return null;
  const s = String(Math.round(Number(n)));
  if (s.length <= 3) return `₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${rest},${last3}`;
}

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const pkgLabel = (p) => `${p.hrs} hrs / ${p.km} km`;
/** Same package, for use after a "/" in the headline — avoids "from ₹1,200 / 4 hrs / 40 km". */
const pkgUnit = (p) => `${p.hrs} hrs · ${p.km} km`;
const ON_REQUEST = 'On request';

function waLink(data, vehicleName, kind = 'consumer', override) {
  const tpl =
    override ||
    (kind === 'corporate' ? data.whatsapp.corporatePrefill : data.whatsapp.consumerPrefill);
  const text = tpl.replace('{vehicle}', vehicleName);
  return `https://api.whatsapp.com/send?phone=${data.whatsapp.phone}&text=${encodeURIComponent(text)}`;
}

const row = (label, value) =>
  `        <li class="fc-row"><span>${esc(label)}</span><span>${esc(value)}</span></li>`;

/* ── card builders ───────────────────────────────────────── */

function cardShell({ classes = '', name, seats, body, image, rate, rateUnit, rows, cta, href }) {
  const cls = ['fare-card', classes].filter(Boolean).join(' ');
  const img = image
    ? `\n      <img class="fc-img" src="${esc(image)}" alt="${esc(name)} for hire in Chennai — S V CABS" loading="lazy" width="320" height="130">`
    : '';
  const meta = [seats, body].filter(Boolean).join(' · ');
  const unit = rateUnit ? ` <small>/ ${esc(rateUnit)}</small>` : '';
  const list = rows.length
    ? `\n      <ul class="fc-rows">\n${rows.join('\n')}\n      </ul>`
    : '\n      <div style="margin-top:1.1rem"></div>';
  return `    <div class="${cls}">${img}
      <h3>${esc(name)}</h3>
      <p class="fc-seats">${esc(meta)}</p>
      <div class="fc-rate">${esc(rate)}${unit}</div>${list}
      <a href="${href}" target="_blank" rel="noopener" class="fc-btn"><i class="fab fa-whatsapp"></i> ${esc(cta)}</a>
    </div>`;
}

function pendingCard(data, v) {
  warnings.push(`  · ${v.name} (${v.id}) — rates pending, rendering quote CTA`);
  return cardShell({
    classes: 'is-pending',
    name: v.name,
    seats: v.seats && v.seats !== '—' ? `${v.seats} seater` : null,
    body: v.body,
    image: v.image,
    rate: 'Rate on request',
    rows: [],
    cta: 'Get a quote',
    href: waLink(data, v.name),
  });
}

function quoteCard(data, q) {
  const blurb = q.blurb
    ? `\n      <p class="fc-blurb">${esc(q.blurb)}</p>`
    : '';
  const href = waLink(data, q.name, q.cta === 'corporate' ? 'corporate' : 'consumer', q.prefill);
  const label = q.cta === 'corporate' ? 'Request a proposal' : 'Get a quote';
  return `    <div class="fare-card is-quote">
      <h3>${esc(q.name)}</h3>
      <p class="fc-seats">${esc(q.seats || '')}</p>
      <div class="fc-rate">Message for a quote</div>${blurb}
      <a href="${href}" target="_blank" rel="noopener" class="fc-btn"><i class="fab fa-whatsapp"></i> ${label}</a>
    </div>`;
}

function vehicleCard(data, v, mode) {
  if (v.status === 'pending') return pendingCard(data, v);

  const href = waLink(data, v.name);
  const seats = v.seats && v.seats !== '—' ? `${v.seats} seater` : null;
  const base = { name: v.name, seats, body: v.body, image: v.image, cta: 'Confirm final fare', href };
  const pkgs = v.local?.packages ?? [];
  const os = v.outstation;
  const rows = [];

  if (mode === 'airport') {
    if (!v.airport) {
      return cardShell({
        ...base,
        classes: 'is-quote',
        rate: 'Quote on WhatsApp',
        rows: [row('Airport entry charge', 'Included')],
        cta: 'Get a quote',
      });
    }
    return cardShell({
      ...base,
      rate: `from ${inr(v.airport.from)}`,
      rateUnit: 'transfer',
      rows: [
        row('Airport entry charge', 'Included'),
        row('Waiting on delayed flights', 'Not charged'),
        row('Advance payment', 'None'),
      ],
    });
  }

  if (mode === 'outstation') {
    if (!os) {
      return cardShell({
        ...base,
        classes: 'is-quote',
        rate: 'Quote on WhatsApp',
        rows: [row('Driver batta / day', v.driverBatta ? inr(v.driverBatta) : ON_REQUEST)],
        cta: 'Get a quote',
      });
    }
    rows.push(row(`Minimum per day`, `${os.minKm} km`));
    rows.push(row('Extra km', inr(os.addlKm)));
    rows.push(row('Driver batta / day', v.driverBatta ? inr(v.driverBatta) : ON_REQUEST));
    return cardShell({
      ...base,
      rate: `from ${inr(os.base)}`,
      rateUnit: `${os.minKm} km`,
      rows,
    });
  }

  // full / hourly / local all lead with the smallest package.
  if (!pkgs.length) {
    return cardShell({
      ...base,
      classes: 'is-quote',
      rate: 'Quote on WhatsApp',
      rows: [],
      cta: 'Get a quote',
    });
  }
  // A one-way pickup & drop rate, where offered, is cheaper than any package — so it
  // becomes the "from" figure and every package drops into the rows beneath it.
  const leadsWithTransfer = v.transfer && v.transfer.from < pkgs[0].price;
  const [head, ...rest] = leadsWithTransfer ? [null, ...pkgs] : pkgs;

  if (!leadsWithTransfer && v.transfer) rows.push(row('Pickup & drop', inr(v.transfer.from)));
  for (const p of rest) rows.push(row(pkgLabel(p), inr(p.price)));
  rows.push(row('Extra km', inr(v.local.addlKm)));
  rows.push(row('Extra hour', inr(v.local.addlHr)));

  if (mode === 'full') {
    rows.push(
      row(
        os ? `Outstation (min ${os.minKm} km/day)` : 'Outstation',
        os ? inr(os.base) : ON_REQUEST
      )
    );
    if (os) rows.push(row('Outstation extra km', inr(os.addlKm)));
    rows.push(row('Driver batta / day', v.driverBatta ? inr(v.driverBatta) : ON_REQUEST));
  }

  return cardShell({
    ...base,
    rate: `from ${inr(leadsWithTransfer ? v.transfer.from : head.price)}`,
    rateUnit: leadsWithTransfer ? 'pickup & drop' : pkgUnit(head),
    rows,
  });
}

/* ── page assembly ───────────────────────────────────────── */

function selectVehicles(data, cfg, file) {
  if (cfg.vehicles) {
    return cfg.vehicles.map((id) => {
      const v = data.vehicles.find((x) => x.id === id);
      if (!v) fail(`${file}: pages.vehicles references unknown id "${id}"`);
      return v;
    }).filter(Boolean);
  }
  if (cfg.groups) {
    return data.vehicles.filter((v) => cfg.groups.includes(v.group));
  }
  return [];
}

function buildCards(data, cfg, file) {
  const out = [];
  const vehicles = selectVehicles(data, cfg, file);

  if (vehicles.length) {
    const groupsUsed = cfg.groups && cfg.groups.length > 1;
    if (groupsUsed) {
      for (const gid of cfg.groups) {
        const g = data.groups.find((x) => x.id === gid);
        if (!g) { fail(`${file}: unknown group "${gid}"`); continue; }
        const inGroup = vehicles.filter((v) => v.group === gid);
        if (!inGroup.length) continue;
        out.push(`  <div class="eyebrow" style="margin-top:2.4rem">${esc(g.label)} · ${esc(g.eyebrow)}</div>`);
        out.push('  <div class="fare-grid">');
        out.push(inGroup.map((v) => vehicleCard(data, v, cfg.fields)).join('\n'));
        out.push('  </div>');
      }
    } else {
      out.push('  <div class="fare-grid">');
      out.push(vehicles.map((v) => vehicleCard(data, v, cfg.fields)).join('\n'));
      out.push('  </div>');
    }
  }

  const quoteIds = cfg.quoteOnlyIds ?? (cfg.quoteOnly ? data.quoteOnly.map((q) => q.id) : []);
  if (quoteIds.length) {
    const cards = quoteIds.map((id) => {
      const q = data.quoteOnly.find((x) => x.id === id);
      if (!q) fail(`${file}: quoteOnlyIds references unknown id "${id}"`);
      return q;
    }).filter(Boolean);
    if (vehicles.length) {
      out.push('  <div class="eyebrow" style="margin-top:2.4rem">Quoted per requirement</div>');
    }
    out.push('  <div class="fare-grid">');
    out.push(cards.map((q) => quoteCard(data, q)).join('\n'));
    out.push('  </div>');
  }

  if (vehicles.length) {
    out.push(`  <p class="fare-note"><i class="fas fa-circle-info"></i> ${esc(data.source)}</p>`);
  }

  if (cfg.terms) {
    const items = data.terms.map((t) => `      <li>${esc(t)}</li>`).join('\n');
    out.push(`  <div class="feature-card" style="margin-top:2.4rem">
    <div class="fc-icon"><i class="fas fa-circle-info"></i></div>
    <h3>What your fare includes</h3>
    <ul style="color:var(--gray);font-size:.9rem;line-height:1.85;margin:.6rem 0 0;padding-left:1.1rem">
${items}
    </ul>
  </div>`);
  }

  return out.join('\n');
}

/* ── JSON-LD ─────────────────────────────────────────────── */

function offerFor(v, mode, file) {
  const url = `https://svcabs.net/${file}`;
  const mk = (name, price) => ({
    '@type': 'Offer',
    name,
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: String(price),
      priceCurrency: 'INR',
      valueAddedTaxIncluded: false,
    },
    itemOffered: { '@type': 'Service', name: `${v.name} car rental, Chennai` },
    availability: 'https://schema.org/InStock',
    url,
  });

  if (mode === 'airport') return v.airport ? [mk(`${v.name} — Chennai airport transfer`, v.airport.from)] : [];
  if (mode === 'outstation') return v.outstation ? [mk(`${v.name} — outstation, minimum ${v.outstation.minKm} km/day`, v.outstation.base)] : [];
  const pkgs = v.local?.packages ?? [];
  const offers = pkgs.map((p) => mk(`${v.name} — ${pkgLabel(p)}`, p.price));
  if (v.transfer) offers.unshift(mk(`${v.name} — pickup & drop`, v.transfer.from));
  return offers;
}

function buildLd(data, cfg, file) {
  const vehicles = selectVehicles(data, cfg, file).filter((v) => v.status !== 'pending');
  const offers = vehicles.flatMap((v) => offerFor(v, cfg.fields, file));
  if (!offers.length) return '';
  const doc = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'S V CABS, Chennai — indicative tariff',
    url: `https://svcabs.net/${file}`,
    provider: { '@type': 'TaxiService', name: 'S V CABS', url: 'https://svcabs.net' },
    itemListElement: offers,
  };
  return `  <script type="application/ld+json">\n${JSON.stringify(doc, null, 2)
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n  </script>`;
}

/* ── marker splice ───────────────────────────────────────── */

function splice(src, start, end, body, file, required) {
  const i = src.indexOf(start);
  const j = src.indexOf(end);
  if (i === -1 || j === -1) {
    if (required) fail(`${file}: missing marker ${i === -1 ? start : end}`);
    return src;
  }
  if (src.indexOf(start, i + 1) !== -1 || src.indexOf(end, j + 1) !== -1) {
    fail(`${file}: duplicate ${start}/${end} marker`);
    return src;
  }
  if (j < i) {
    fail(`${file}: ${end} appears before ${start}`);
    return src;
  }
  const inner = body ? `\n${body}\n  ` : '\n  ';
  return src.slice(0, i + start.length) + inner + src.slice(j);
}

/* ── main ────────────────────────────────────────────────── */

/* Strip a UTF-8 BOM — some Windows editors add one, and JSON.parse chokes on it. */
let data;
try {
  data = JSON.parse(readFileSync(DATA, 'utf8').replace(/^﻿/, ''));
} catch (e) {
  console.error(`\nbuild-fares: FAILED — assets/data/fares.json is not valid JSON\n  ✗ ${e.message}\n`);
  process.exit(1);
}

for (const v of data.vehicles) {
  if (v.status === 'published' && !v.local?.packages?.length) {
    fail(`fares.json: published vehicle "${v.id}" has no local packages`);
  }
}

/* Phase 1 — render everything in memory. Nothing is written yet, so a bad
   fares.json can never leave the site half-updated. */
const pending = [];

for (const [file, cfg] of Object.entries(data.pages)) {
  const path = join(ROOT, file);
  let src;
  try {
    src = readFileSync(path, 'utf8');
  } catch {
    fail(`pages references "${file}" which does not exist`);
    continue;
  }

  let out = splice(src, CARD_START, CARD_END, buildCards(data, cfg, file), file, true);
  out = splice(out, LD_START, LD_END, cfg.schema ? buildLd(data, cfg, file) : '', file, false);

  if (out !== src) pending.push([file, path, out]);
}

/* Phase 2 — abort before touching disk if anything is wrong. */
if (problems.length) {
  console.error(
    '\nbuild-fares: FAILED — no files written\n' +
      [...new Set(problems)].map((p) => `  ✗ ${p}`).join('\n') +
      '\n'
  );
  process.exit(1);
}

const touched = pending.map(([file]) => file);
const changed = pending.length;
if (!CHECK) for (const [, path, out] of pending) writeFileSync(path, out);

if (warnings.length) {
  console.warn('\nbuild-fares: rates still pending —\n' + [...new Set(warnings)].join('\n'));
}

if (CHECK) {
  if (changed) {
    console.error(`\nbuild-fares --check: ${changed} file(s) out of date — run: node tools/build-fares.mjs\n` +
      touched.map((f) => `  · ${f}`).join('\n') + '\n');
    process.exit(1);
  }
  console.log('\nbuild-fares --check: all pages in sync with fares.json\n');
} else {
  console.log(`\nbuild-fares: ${changed} file(s) updated${changed ? '\n' + touched.map((f) => `  · ${f}`).join('\n') : ''}\n`);
}
