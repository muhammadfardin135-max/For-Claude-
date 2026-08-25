#!/usr/bin/env bash
#
# Launch Chromium with CDP (remote debugging) on port 9222 so browser-use can
# attach to it, routed through this session's agent proxy.
#
# Usage:
#   ./scripts/launch-chrome-cdp.sh &
#   export BU_CDP_URL=http://127.0.0.1:9222
#   browser-use <<'PY'
#   new_tab("https://example.com"); print(page_info())
#   PY
#
# Prerequisite (once per container): trust the agent proxy CA in the NSS store
# that Chromium reads, otherwise every HTTPS page fails ERR_CERT_AUTHORITY_INVALID:
#   apt-get install -y libnss3-tools
#   certutil -d sql:"$HOME/.pki/nssdb" -A -t "C,," \
#            -n "CCR Agent Proxy CA" -i /root/.ccr/agent-proxy-ca.crt
#
set -euo pipefail

PORT="${BU_CDP_PORT:-9222}"
WORKDIR="${BU_CHROME_DIR:-${TMPDIR:-/tmp}/browser-use-chrome}"
PROFILE="$WORKDIR/chrome-profile"

# Locate a Chromium/Chrome binary.
BIN="${BU_CHROME_BIN:-}"
if [[ -z "$BIN" ]]; then
  for candidate in /opt/pw-browsers/chromium google-chrome chromium chromium-browser; do
    if [[ -x "$candidate" ]] || command -v "$candidate" >/dev/null 2>&1; then
      BIN="$candidate"; break
    fi
  done
fi
if [[ -z "$BIN" ]]; then
  echo "No Chromium/Chrome binary found; set BU_CHROME_BIN." >&2
  exit 1
fi

# Route egress through the session's agent proxy. Only HTTPS_PROXY is supported
# by the proxy (it rejects plain-HTTP, non-CONNECT requests).
PROXY="${HTTPS_PROXY:-${https_proxy:-}}"

ARGS=(
  --remote-debugging-port="$PORT"
  --remote-debugging-address=127.0.0.1
  --user-data-dir="$PROFILE"
  # The agent proxy's egress path resets Chromium's TLS 1.3 ClientHello
  # (ERR_CONNECTION_RESET). Capping at TLS 1.2 is the only setting found to
  # work; it caps the negotiated version only and leaves certificate
  # verification fully enabled.
  --ssl-version-max=tls1.2
  --disable-background-networking
  --disable-component-update
  --no-first-run
  --no-default-browser-check
  --headless=new
  --no-sandbox
  --disable-gpu
  --disable-dev-shm-usage
)

if [[ -n "$PROXY" ]]; then
  ARGS+=( --proxy-server="$PROXY" )
fi

mkdir -p "$PROFILE"
exec "$BIN" "${ARGS[@]}" about:blank
