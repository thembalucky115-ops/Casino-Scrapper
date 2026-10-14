# Casino Bonus Snapshot

A small screening-task project: one Python command fetches a public comparison page, checks the site's robots.txt, extracts three casino offers, asks an LLM to normalize the terms, and writes `bonuses.json` in the project root. The static page renders that JSON as a readable desktop table and mobile cards.

## Run it in VS Code

1. Open this folder in VS Code. Use Python 3.10 or newer.
2. In the integrated terminal, create and activate a virtual environment, then install dependencies:

   ```bash
   python -m venv .venv
   # macOS/Linux
   source .venv/bin/activate
   # Windows PowerShell: .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and set `OPENAI_API_KEY` to your own compatible API key. The LLM handles wording/normalization; the scraper does not invent missing fields. Never commit `.env`.
4. Run the scraper:

   ```bash
   python scraper.py
   ```

5. Start the page locally (the browser must load the JSON over HTTP):

   ```bash
   python -m http.server 8000
   ```

   Open <http://localhost:8000>. Run `pytest` for parser tests.

## Source and responsible access

The single source is the Covers New Jersey casino-bonus comparison page: <https://www.covers.com/casino/bonuses/new-jersey>. The script fetches that public page and its `robots.txt`, checks permission before parsing, identifies BetMGM Casino, DraftKings Casino and Caesars Palace from the comparison table, and uses the page URL as each record's source link. It does not request claim/affiliate redirect URLs. The source's robots rules disallow several redirect and utility paths; those are not requested. If the page disallows this URL, returns an access block/rate limit, or changes so required fields cannot be extracted, the run stops. Do not add browser impersonation, proxies, CAPTCHA solving, or retries to get around a block; choose a different permitted source instead.

Bonus information changes and may depend on location, eligibility and full terms. The page is a demonstration, not gambling advice or an endorsement. Verify current rules with the operator and source. 21+; play responsibly.

## Publish free with GitHub Pages

The page is static and needs no server-side secret. The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`; it deploys the site whenever `main` is pushed. To publish from VS Code, open this folder, initialize Git in **Source Control**, commit the project, choose **Publish to GitHub**, and create a **public** repository (for example, `casino-bonus-snapshot`). Then open that repository's **Settings → Pages** and set the build/deployment source to **GitHub Actions**. The workflow should run and the Pages URL will appear in the repository's Pages settings and workflow deployment. Open it and verify the JSON loads. `bonuses.json` will be public, so review it before pushing. Do not commit `.env` or API keys. For updates, run `python scraper.py`, review the changed JSON, and commit/push the reviewed output. The page links to its upstream source and shows when the snapshot was generated.

## Production plan (200 casinos, daily updates)

For 200 sources, I would keep the front end static on GitHub Pages and run ingestion in a dedicated GitHub Actions workflow at a fixed daily UTC time. A small Python worker would read a versioned source registry, fetch only robots-allowed pages at low per-domain rates, use per-site parsers with recorded selectors, and stop on 403/429 rather than retry around a block. LLM calls would be limited to ambiguous free-text terms; deterministic parsing would handle obvious currencies and multipliers. Each record would retain its source URL, raw evidence, normalized values, scrape time, parser version and confidence. A validation gate would publish a new snapshot only when required records pass checks; diffs would flag unusually large offer changes for review. The workflow would write canonical records to a managed PostgreSQL database such as Supabase, then generate the public JSON used by the static page. GitHub Actions secrets would hold API/database credentials.

I would use PostgreSQL because the data is relational, easy to query by casino/date, and supports transactions for replacing each daily snapshot. I would enable the provider's managed backups, and add a nightly encrypted `pg_dump` to a separate object-storage bucket with a retention policy; I would test restores quarterly. Cloudflare Registrar (or another registrar) would own the domain, with DNS proxied/managed by Cloudflare and HTTPS provided automatically at the edge and by GitHub Pages. A failed job, missing casino, stale snapshot or schema error would fail the workflow and alert an on-call email/Slack webhook; a small external uptime check would also test the published page and its data timestamp.

As a rough starting budget, I would plan on **about $30–$45/month**: roughly $25 for a managed database tier, $1–$3 for backup storage, under $5 for modest LLM usage, and around $1–$2/month annualized for a domain. GitHub Pages and a low-volume Actions workflow can start on their free allowances. Actual price depends on provider, retention, model, and run volume, so I would confirm vendor pricing before launch and add budget alerts.
