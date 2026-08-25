#!/usr/bin/env bash
# Verifies BROWSERBASE_API_KEY / BROWSERBASE_PROJECT_ID actually work
# by opening a real Browserbase session through the hosted MCP server.
set -uo pipefail

: "${BROWSERBASE_API_KEY:?BROWSERBASE_API_KEY is not set}"
: "${BROWSERBASE_PROJECT_ID:?BROWSERBASE_PROJECT_ID is not set}"

URL="https://mcp.browserbase.com/mcp?browserbaseApiKey=${BROWSERBASE_API_KEY}&browserbaseProjectId=${BROWSERBASE_PROJECT_ID}"
HDRS=(-H "Content-Type: application/json" -H "Accept: application/json, text/event-stream")
INIT='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"verify","version":"1"}}}'

SID=$(curl -sS -D - -o /dev/null -X POST "$URL" "${HDRS[@]}" -d "$INIT" \
      | grep -i '^mcp-session-id' | tr -d '\r' | cut -d' ' -f2)

if [ -z "${SID:-}" ]; then
  echo "FAIL: no MCP session id returned — endpoint unreachable or rejected the request."
  exit 1
fi

curl -sS -X POST "$URL" "${HDRS[@]}" -H "mcp-session-id: $SID" \
     -d '{"jsonrpc":"2.0","method":"notifications/initialized"}' >/dev/null

RES=$(curl -sS -X POST "$URL" "${HDRS[@]}" -H "mcp-session-id: $SID" \
      -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"start","arguments":{}}}')

if grep -q '401 Unauthorized' <<<"$RES"; then
  echo "FAIL: 401 Unauthorized — the API key or project ID is wrong."
  exit 1
fi
if grep -qi '"isError":true' <<<"$RES"; then
  echo "FAIL: Browserbase returned an error:"; sed 's/^data: //' <<<"$RES" | tail -2
  exit 1
fi

echo "OK: Browserbase session opened successfully."
sed 's/^data: //' <<<"$RES" | tail -1 | cut -c1-300
