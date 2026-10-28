
name: Live stats

on:
  workflow_dispatch:
  schedule:
    - cron: "23 * * * *"

permissions:
  contents: write

jobs:
  stats:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Check required files
        run: |
          test -f scripts/fetch-live-stats.js
          test -f data/live-stats.json

      - name: Fetch live stats
        env:
          CLOUDFLARE_RADAR_API_TOKEN: ${{ secrets.CLOUDFLARE_RADAR_API_TOKEN }}
        run: node scripts/fetch-live-stats.js

      - name: Save updated stats
        run: |
          git config user.name "firibstop-bot"
          git config user.email "bot@users.noreply.github.com"
          git add data/live-stats.json
          if ! git diff --cached --quiet; then
            git commit -m "Update live stats"
            git push
          else
            echo "No data changes to commit"
          fi
