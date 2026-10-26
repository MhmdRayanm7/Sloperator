import { spawn } from "node:child_process"
import { isAbsolute, relative, resolve as resolvePath, sep } from "node:path"

import { Plugin } from "@opencode/plugin"

interface RunResult {
  stdout: string
  stderr: string
  exitCode: number
}

/**
 * Run a command without a shell so the argument vector is passed verbatim.
 * This removes any shell metacharacter / injection surface.
 */
function execute(
  command: string,
  args: readonly string[],
  cwd: string,
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: false })
    let stdout = ""
    let stderr = ""

    child.stdout.setEncoding("utf8")
    child.stderr.setEncoding("utf8")
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk
    })
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk
    })
    child.on("error", reject)
    child.on("close", (code) => {
      resolve({ stdout, stderr, exitCode: code ?? -1 })
    })
  })
}

export default Plugin.define({
  id: "sloperator.run-slop",

  async setup(ctx) {
    const projectRoot = ctx.location.directory

    await ctx.tool.transform((editor) => {
      editor.add({
        name: "run_slop",
        description:
          "Run a SlopLang program through the Sloperator interpreter and return its " +
          "stdout, stderr, and exit code as JSON. Call this tool directly instead of " +
          "using Code Mode or a shell command.",
        input: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to a .slop file, relative to the project root.",
            },
          },
          required: ["path"],
          additionalProperties: false,
        },
        options: { codemode: false },
        execute: async (input) => {
          const requested = (input as { path?: unknown }).path

          if (typeof requested !== "string" || requested.length === 0 || requested.includes("\0")) {
            return { content: JSON.stringify({ error: "path must be a non-empty string" }) }
          }

          // Resolve against the project root and refuse anything that escapes it,
          // so a caller cannot read or run files outside the project.
          const absolute = resolvePath(projectRoot, requested)
          const rel = relative(projectRoot, absolute)
          if (rel === "" || rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
            return {
              content: JSON.stringify({ error: `path escapes the project root: ${requested}` }),
            }
          }

          try {
            const result = await execute(
              "uv",
              ["run", "--no-active", "sloperator.py", absolute],
              projectRoot,
            )
            return { content: JSON.stringify(result) }
          } catch (error) {
            return { content: JSON.stringify({ error: (error as Error).message }) }
          }
        },
      })
    })

    await ctx.tool.transform((tools) => {
      tools.update("run_slop", (tool) => {
        tool.description +=
          "\n\nUse this tool to run individual .slop examples when checking language behavior. " +
          "Use the test suite for regression testing."
      })
    })
  },
})
