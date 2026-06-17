# Play Pause Films — v2

A complete redesign and rebuild of the Play Pause Films website as a premium, technical,
cinematic production-studio site. Build-free (plain HTML, CSS and vanilla JavaScript — no
framework, no build step). The original site is **untouched**: it still lives on its own
Canva-exported hosting at <https://playpausefilms.com/>. This is a fresh, self-contained
copy in `F:\playpause-v2\`.

## Run / preview

It is a static site. Either:

- Double-click `index.html`, or
- Serve the folder (recommended, so video lazy-loading and the YouTube embeds behave):
  ```
  npx serve .
  ```
  then open the printed URL.

## What this is

- One page, semantic HTML5, accessible, responsive (mobile / tablet / desktop).
- Dark cinematic UI with thin grid guides, live SMPTE-style timecode, an edit-timeline
  motif, camera framing marks and metadata labels — a "production control room" feel.
- A single controlled accent (tally-light amber `#f4b740`) over an off-white-on-near-black
  palette.
- Performance-minded: hero video is deferred and adaptive; clip videos lazy-load and pause
  off-screen; YouTube uses a click-to-load facade (`youtube-nocookie`); images are
  lazy-loaded with explicit dimensions to avoid layout shift; `prefers-reduced-motion` and
  data-saver are respected.

## Nothing was removed — preservation map

Every piece of text, every asset, every link from the original is preserved and reused.
Local files keep the original asset hash in their name so they are traceable.

### Copy (verbatim)

| Original text | Where it now lives |
| --- | --- |
| "At Play Pause Films, we passionately believe in transforming every moment into a compelling narrative. As dedicated artists and storytellers, our unique approach to filmmaking goes beyond mere image capture." | Studio / Manifesto section |
| "Specialising in artist-to-client experience. Our team is dedicated to crafting videos that capture the essence of your message and have fun while doing it." | Artist-to-client (Experience) section |
| "Get in touch" | Header CTA, hero CTA, Contact heading |
| Download pricing matrix (Google Drive link) | Hero CTA + Contact CTA |
| Email: kyle@playpausefilms.co.uk | Contact + footer + mobile nav (mailto:) |
| Phone: 074489243942 | Contact + footer + mobile nav (tel:) |

### Video (the originals — "keep the video")

The original site uses four native video clips plus YouTube embeds. All are kept.

| Original (Canva CDN) | Local file | Used as |
| --- | --- | --- |
| `_assets/video/35f366…mp4` / `647c7f…mp4` (clip 1, 1920×1080, 24fps) | `clip1-hero-720.mp4`, `clip1-hero-360.mp4` | Hero background + Work tile + Experience |
| `_assets/video/40c3ad…mp4` / `e89c55…mp4` (clip 2 — brand montage) | `clip2-brandreel-720.mp4`, `clip2-brandreel-360.mp4` | Retained in `assets/video/` but no longer displayed (replaced by the CSS logo marquee at your request — nothing deleted) |
| `_assets/video/192de8…mp4` (clip 3 — street) | `clip3-street-360.mp4` | Work grid (capture tile) |
| `_assets/video/f1e2ef…mp4` (clip 4 — aerial mural) | `clip4-mural-540.mp4` | Work grid (aerial tile) |
| YouTube `eij7r7p2xXU`, `m_BMZfvzcGk`, `kJl_QygGDws` | embedded on click | Featured films section |

Web-optimised renditions (720p/360p/540p) were chosen over the 1080p/HLS masters for speed;
the masters still exist on the original CDN and can be swapped in if ever wanted.

### Images, logo, icons

| Original | Local file | Used as |
| --- | --- | --- |
| `_assets/video/fb9b64…jpg` | `poster_fb9b64….jpg` | Hero poster + reel Frame 01 |
| `_assets/video/154c1a…jpg` | `poster_154c1a….jpg` | Reel gallery (Frame 04) |
| `_assets/video/cb3549…jpg` | `poster_cb3549….jpg` | Street clip poster + reel Frame 02 |
| `_assets/video/e139dd…jpg` | `poster_e139dd….jpg` | Aerial clip poster + reel Frame 03 |
| `_assets/media/0625dc…png` | `media_0625dc….png` | Wordmark logo (header, footer brand, and footer sign-off watermark) |
| `_assets/media/9749e0…png` | `media_9749e0….png` | Retained on disk; Studio overlay removed at your request (no longer displayed) |
| `_assets/media/7f74ae…png` | `media_7f74ae….png` | Experience section grain texture |
| `_assets/media/f986f0…png` | `media_f986f0….png` | Retained on disk; removed from display — this is a third-party (Ministry of Sound) crest, not the Play Pause Films logo |
| `_assets/media/3d87cb…png` | `media_3d87cb….png` | Hero scroll chevron |
| `_assets/media/dc8f89…png` | `media_dc8f89….png` | Instagram icon |
| `_assets/media/e19000…png` | `media_e19000….png` | YouTube icon |
| `_assets/media/7255e1…png` | `media_7255e1….png` | TikTok icon |
| `_assets/images/3ed1f8…jpg` | `og-image.jpg` | Open Graph / Twitter image |
| `_assets/images/40ec5e…png` | `icon-192.png` | 192×192 icon |
| `_assets/images/be3e34…png` | `favicon.png` | Favicon |
| `_assets/images/e56f83…png` | `apple-touch-icon.png` | Apple touch icon |

### Social (discovered in the original markup, now wired to the icons)

- Instagram — <https://www.instagram.com/playpausefilms>
- TikTok — <https://www.tiktok.com/@playpausefilms>
- YouTube — <https://www.youtube.com/@playpausefilmsstudios>

### Metadata

`lang="en-GB"`, original OG image and all favicons preserved. The page `<title>` was improved
from the Canva default "HOME" to a descriptive, SEO-friendly title, and a meta description,
canonical, Twitter card and `VideoProductionCompany` structured data were added — all built
only from facts already on the site (no invented services, clients, awards or claims).

## Structure

1. Hero — full-bleed clip 1, framing guides, technical HUD, both CTAs
2. Brand marquee — a seamless CSS logo animation. Uses **placeholder wordmarks** (London
   clubs + grime/DnB artists); swap each `<li>` for a real client logo when available
3. Studio / Manifesto — paragraph one, large type, spec list
4. Selected work — production-dashboard grid of the three film clips with metadata labels
5. Featured films — the three YouTube films (click to load)
6. Artist-to-client — paragraph two, the human side
7. Visual reel — all four stills in a lightbox gallery
8. Contact — Get in touch, pricing matrix, email, phone, social
9. Footer — wordmark, nav, sign-off watermark, live timecode

On-page section numbering follows scroll order: 01 Studio · 02 Selected work ·
03 Featured films · 04 Artist-to-client · 05 Visual reel · 06 Get in touch.

## Notes

- **Brand marquee placeholders.** The scrolling logo strip below the hero uses styled text
  wordmarks for well-known London clubs and grime/DnB artists as *placeholders*, because the
  real client logos in the original reel are only available baked into video, not as clean
  individual files. To use real logos, drop an `<img>`/`<svg>` into each `<li class="lw">` in
  the `.marquee__seq` list in `index.html` (the script auto-duplicates the row for a seamless
  loop). Scroll speed is the `--marquee-dur` variable in `styles.css` (default 46s).
- Two decorative PNG textures (`media_9749e…`, `media_7f74ae…`) are large originals; they are
  lazy-loaded and below the fold. If a tool such as ImageMagick/Squoosh is available they can
  be recompressed for a further saving (none was installed in the build environment).
- Verified: all 22 referenced assets resolve, every original text string and link is present,
  and the page was render-checked at desktop and mobile widths.
