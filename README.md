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



