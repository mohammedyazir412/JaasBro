# JAAS BRO — Website

A modern, responsive, single-page static website for **JAAS BRO Education & Career Services**, built with plain HTML5, CSS3 and vanilla JavaScript (no frameworks, no build step).

## 1. Project Structure

```
jaas-bro-academy/
│
├── index.html        Single-page site (all sections)
├── style.css          All styles (variables, layout, responsive rules)
├── script.js          Tabs, mobile nav, scroll reveal, form validation, WhatsApp links
├── assets/
│   └── logo.svg        Crest logo (vector, based on the JAAS BRO posters)
│   └── images/         Put additional photos / poster scans here
└── README.md
```

> No raster copies of the two source posters were available as files, so the logo was rebuilt as a vector (`assets/logo.svg`) and every other visual (hero card, country cards, icons) was built directly in CSS/SVG rather than guessing at photography. Swap in real photos wherever you like — see section 3 below.

## 2. How to Run It

This is a fully static site — no Node, no build tools, no server required.

- **Quickest:** double-click `index.html` to open it directly in a browser.
- **Recommended (avoids browser file:// quirks):** serve it locally, e.g.
  ```bash
  # Python 3
  python -m http.server 8080
  # then open http://localhost:8080
  ```
  or use the VS Code "Live Server" extension.

To publish it, upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel, etc.) — `index.html` is the entry point.

## 3. Where to Replace Images

- `assets/logo.svg` — replace with your official logo file if you have a high-res original (keep the same filename, or update the `<img src>` references in `index.html`).
- The hero, country and program cards currently use CSS gradients + inline SVG icons instead of photos. To add real photography:
  - Add files to `assets/images/`.
  - In `index.html`, swap the relevant `<div class="...-icon">…</div>` block for an `<img>` tag pointing at your new file, and add descriptive `alt` text.

## 4. Where to Update Phone Numbers

Search `index.html` for `81444 82444` and `96554 48899` (also present as `tel:` links and inside `script.js` as `WHATSAPP_NUMBER`).

- Phone/`tel:` links: [index.html](index.html) — Contact section (`#contact`) and the footer.
- WhatsApp number: [script.js](script.js) — top of the file, `var WHATSAPP_NUMBER = "919655448899";` (country code + number, no `+` or spaces).

> ⚠️ One of the source posters shows **81444 26444**, while the written brief for this build specified **81444 82444**. Please confirm the correct digits and update both files if needed — marked with a `TODO` comment in the code.

## 5. Where to Update the Address

`index.html` → Contact section (`#contact`) and the footer. Search for `Gnanaolivupuram`.

> ⚠️ The exact street/area spelling was not fully legible from the source poster. A `<!-- TODO: Confirm exact address spelling against original poster -->` comment marks the spot — please verify and correct before publishing. The Google Maps button URL should also be updated to match.

## 6. Where to Update Course Information

`script.js` → top of the file, `PROGRAM_DATA` object (`ug` and `pg` arrays). Program cards, the tab panels, and the contact form's "Interested Program" dropdown are all generated automatically from this single list — edit it once and everything updates.

## 7. Where to Change Colors

`style.css` → `:root` block near the top (`--navy`, `--navy-2`, `--gold`, `--white`, `--light`, `--text`). All components reference these CSS variables, so changing a value here updates the whole site.

## 8. Where to Modify the WhatsApp Number

`script.js` → `WHATSAPP_NUMBER` constant (see section 4 above). This single value drives the floating WhatsApp button, the Contact section's WhatsApp button, and the "Send via WhatsApp" button on the enquiry form.

## Notes on Content Accuracy

Per the source posters, this build intentionally avoids inventing:
- University names, accreditation or government-approval claims
- Student numbers, placement percentages or success rates
- Fees, scholarships or admission guarantees

Only information visible on the provided posters (or clearly reasonable placeholder copy) was used. Anything uncertain is marked with an HTML `TODO` comment — search `index.html` for `TODO` before going live.
