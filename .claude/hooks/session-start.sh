#!/bin/bash
#
# SessionStart hook: rebuild the browser-use setup at the start of every
# Claude Code on the web session.
#
# The remote container is discarded when a session ends, so the tool, the skill
# registration and the running browser all have to be recreated each time.
# Everything here is idempotent and non-interactive.
#
set -euo pipefail

# Local machines keep their own setup; only rebuild in the remote container.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

LOG=/tmp/browser-use-setup.log
: > "$LOG"
export PATH="$HOME/.local/bin:$PATH"

# 1. Install the browser-use CLI on Python 3.12. Skipped when already present.
if ! command -v browser-use >/dev/null 2>&1; then
  uv tool install --python 3.12 browser-use >>"$LOG" 2>&1
fi

# 2. Register the browser-use skill so the agent knows how to drive the browser.
#    This also self-upgrades the library to the current release.
browser-use skill install >>"$LOG" 2>&1 || true

# 3. Start headless Chromium with remote debugging, unless it is already up.
#    setsid detaches it so it outlives this hook.
if ! curl -sf --noproxy '*' http://127.0.0.1:9222/json/version >/dev/null 2>&1; then
  setsid nohup "$CLAUDE_PROJECT_DIR/scripts/launch-chrome-cdp.sh" \
    >/tmp/browser-use-chrome.log 2>&1 < /dev/null &
  disown || true
  for _ in $(seq 1 30); do
    curl -sf --noproxy '*' http://127.0.0.1:9222/json/version >/dev/null 2>&1 && break
    sleep 1
  done
fi

# 4. Hand the session the settings it needs. Without BU_CDP_URL the browser-use
#    daemon scans the standard Chrome profile directories and will not find a
#    browser started on a custom --user-data-dir.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  {
    echo 'export PATH="$HOME/.local/bin:$PATH"'
    echo 'export BU_CDP_URL="http://127.0.0.1:9222"'
  } >> "$CLAUDE_ENV_FILE"
fi

if curl -sf --noproxy '*' http://127.0.0.1:9222/json/version >/dev/null 2>&1; then
  echo "browser-use ready: browser listening on 127.0.0.1:9222"
else
  echo "browser-use setup incomplete; see $LOG and /tmp/browser-use-chrome.log"
fi
