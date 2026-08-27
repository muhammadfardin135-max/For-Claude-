#!/usr/bin/env bash
# Start headless Chromium with CDP on 127.0.0.1:9222.
# No installs required: the Chromium binary already ships in the container.
set -euo pipefail
PORT="${CDP_PORT:-9222}"
BIN="${CHROME_BIN:-/opt/pw-browsers/chromium}"

if curl -sf --noproxy '*' "http://127.0.0.1:$PORT/json/version" >/dev/null 2>&1; then
  echo "already running on $PORT"; exit 0
fi

setsid nohup "$BIN" \
  --remote-debugging-port="$PORT" --remote-debugging-address=127.0.0.1 \
  --user-data-dir="${TMPDIR:-/tmp}/cdp-profile" \
  --ssl-version-max=tls1.2 \
  ${HTTPS_PROXY:+--proxy-server="$HTTPS_PROXY"} \
  --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage \
  --no-first-run --no-default-browser-check --disable-background-networking \
  about:blank >/tmp/chrome-cdp.log 2>&1 </dev/null &
disown

for _ in $(seq 1 30); do
  curl -sf --noproxy '*' "http://127.0.0.1:$PORT/json/version" >/dev/null 2>&1 && {
    echo "chromium ready on 127.0.0.1:$PORT"; exit 0; }
  sleep 1
done
echo "failed to start; see /tmp/chrome-cdp.log" >&2; exit 1
