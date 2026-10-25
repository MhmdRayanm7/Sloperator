---
description: Start or reuse the Sloperator playground server on a port (default 8080)
agent: build
---

Start or reuse the Sloperator playground server.

Interpret `$ARGUMENTS` as the port. If `$ARGUMENTS` is empty, use port `8080`.
Do not pass the port into the listener command below; it is read from `$ARGUMENTS`
and used only in the steps.

Current TCP listeners:

!`lsof -nP -iTCP -sTCP:LISTEN`

## Steps

1. Resolve the port from `$ARGUMENTS`, defaulting to `8080` when omitted. The port
   must be an integer between 1 and 65535; otherwise stop and ask for a valid port.
2. Inspect the listener list above for the resolved port.
   - If `playground/server.py` is already listening on it, reuse that server. Report
     `http://localhost:<port>` and stop. Do not start another instance.
   - If the port is used by any other process, stop and report the conflict. Do not
     kill it, and do not pick a different port unless the user asks.
3. If the port is free, start the server in the background from the project root:

   ```bash
   uv run playground/server.py <port>
   ```

4. Verify it started by confirming the process is listening on the resolved port and
   that it printed `SlopLang playground running at http://localhost:<port>`. If it
   failed to start, report the error and stop. Otherwise report the URL.
