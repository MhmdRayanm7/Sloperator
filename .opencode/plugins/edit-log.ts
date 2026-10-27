import { appendFile, mkdir } from "node:fs/promises"
import { join } from "node:path"

import { Plugin } from "@opencode/plugin"

const LOGGED_TOOLS = new Set(["edit", "write", "patch"])

export default Plugin.define({
  id: "edit-log",

  async setup(ctx) {
    await ctx.tool.hook("execute.after", async (event) => {
      if (event.status !== "completed" || !LOGGED_TOOLS.has(event.tool)) return

      const logsDirectory = join(ctx.location.project.directory, "logs")
      const logPath = join(logsDirectory, "plugin-tools.log")
      const entry = JSON.stringify({ tool: event.tool, status: event.status })

      try {
        await mkdir(logsDirectory, { recursive: true })
        await appendFile(logPath, `${entry}\n`, "utf8")
      } catch (error) {
        console.error("Failed to write tool call log", error)
      }
    })
  },
})
