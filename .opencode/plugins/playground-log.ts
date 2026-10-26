import { appendFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "playground-log",
  async setup(ctx) {
    await ctx.tool.hook("execute.before", async (event) => {
      if (event.tool !== "shell") return

      const input = event.input
      if (
        typeof input !== "object" ||
        input === null ||
        !("command" in input) ||
        typeof input.command !== "string" ||
        !input.command.includes("playground/server.py")
      ) {
        return
      }

      const logsDirectory = join(ctx.location.project.directory, "logs")
      const logPath = join(logsDirectory, "plugin-playground.log")
      try {
        await mkdir(logsDirectory, { recursive: true })
        await appendFile(logPath, "playground shell request\n", "utf8")
      } catch (error) {
        console.error("Failed to write playground shell request log", error)
      }
    })
  },
})
