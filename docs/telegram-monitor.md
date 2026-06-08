# Serenity Telegram Monitor

This monitor watches Serenity's public X timeline through FxTwitter, sends an immediate Telegram alert when a new tweet appears, then sends a ranked research pack after 30 seconds.

## Required Environment

```bash
export TELEGRAM_BOT_TOKEN="123456:telegram-bot-token"
export TELEGRAM_CHAT_ID="-1001234567890"
```

Optional:

```bash
export TELEGRAM_THREAD_ID="123"                     # topic id for Telegram forum groups
export SERENITY_TG_POLL_MS="1000"                   # minimum 1000ms
export SERENITY_TG_DELAY_MS="30000"                 # 30s research pack delay
export SERENITY_TG_QUOTE_BASE="https://serenity-stock-research.netlify.app"
export SERENITY_TG_ALERT_ON_START="1"               # alert the latest tweet on first boot
```

## Commands

```bash
npm run monitor:telegram:test
npm run monitor:telegram:once -- --dry-run
npm run monitor:telegram
```

The state file is stored at `data/telegram-monitor-state.json` and is ignored by git.

## Behavior

- Polls `https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses`.
- Sends a first Telegram message immediately after detecting a new status.
- Extracts cashtags, filters out obvious crypto / non-US symbols, fetches quote details, and sends a 30-second ranked research pack.
- The research pack includes a conclusion, theme, trading logic, confirmation conditions, invalidation conditions, risk notes, and ranked tradable symbols.
- Ranking is research-oriented, not investment advice. It weighs Serenity theme fit, historical mention density, materiality, market cap odds, sentiment, and capital-structure risk.

## Notes

The public FxTwitter route is not an official X streaming API, so sub-second delivery cannot be guaranteed. The script supports 1-second polling, but practical speed depends on FxTwitter availability and Telegram delivery.

The launchd installer stores the Telegram bot token in the generated local plist. Keep that file private and do not commit it to git.
