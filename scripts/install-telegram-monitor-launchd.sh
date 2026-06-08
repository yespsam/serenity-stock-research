#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" || -z "${TELEGRAM_CHAT_ID:-}" ]]; then
  echo "Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID before installing." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LABEL="com.codex.serenity.telegram-monitor"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
NODE_BIN="$(command -v node)"

xml_escape() {
  local value="${1:-}"
  value="${value//&/&amp;}"
  value="${value//</&lt;}"
  value="${value//>/&gt;}"
  value="${value//\"/&quot;}"
  value="${value//\'/&apos;}"
  printf '%s' "$value"
}

mkdir -p "$HOME/Library/LaunchAgents"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$(xml_escape "$LABEL")</string>
  <key>WorkingDirectory</key>
  <string>$(xml_escape "$ROOT")</string>
  <key>ProgramArguments</key>
  <array>
    <string>$(xml_escape "$NODE_BIN")</string>
    <string>$(xml_escape "$ROOT/scripts/telegram-serenity-monitor.js")</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>TELEGRAM_BOT_TOKEN</key>
    <string>$(xml_escape "$TELEGRAM_BOT_TOKEN")</string>
    <key>TELEGRAM_CHAT_ID</key>
    <string>$(xml_escape "$TELEGRAM_CHAT_ID")</string>
    <key>TELEGRAM_THREAD_ID</key>
    <string>$(xml_escape "${TELEGRAM_THREAD_ID:-}")</string>
    <key>SERENITY_TG_POLL_MS</key>
    <string>$(xml_escape "${SERENITY_TG_POLL_MS:-1000}")</string>
    <key>SERENITY_TG_DELAY_MS</key>
    <string>$(xml_escape "${SERENITY_TG_DELAY_MS:-30000}")</string>
    <key>SERENITY_TG_QUOTE_BASE</key>
    <string>$(xml_escape "${SERENITY_TG_QUOTE_BASE:-https://serenity-stock-research.netlify.app}")</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/serenity-telegram-monitor.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/serenity-telegram-monitor.err</string>
</dict>
</plist>
PLIST

launchctl bootout "gui/$(id -u)" "$PLIST" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl kickstart -k "gui/$(id -u)/$LABEL"

echo "Installed $LABEL"
echo "Logs: /tmp/serenity-telegram-monitor.log /tmp/serenity-telegram-monitor.err"
