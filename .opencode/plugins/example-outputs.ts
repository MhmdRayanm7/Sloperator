import { spawn } from "node:child_process"
import type { Dirent } from "node:fs"
import { readdir } from "node:fs/promises"
import { join } from "node:path"

import { Plugin } from "@opencode/plugin"

interface RunResult {
  stdout: string
  stderr: string
  exitCode: number
}

interface ExampleOutput {
  name: string
  exitCode: number
  firstLine: string
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

/** Return the first line of stdout without its trailing newline. */
function firstLine(stdout: string): string {
  return stdout.split(/\r?\n/, 1)[0] ?? ""
}

export default Plugin.define({
  id: "sloperator.example-outputs",

  async setup(ctx) {
    const projectRoot = ctx.location.directory

    await ctx.tool.transform((editor) => {
      editor.add({
        name: "example_outputs",
        description:
          "Run every examples/*.slop program from the project root with " +
          "`uv run --no-active` and return each file's name, exit code, and the " +
          "first line of stdout as a JSON `examples` array. The example files are " +
          "only read, never modified.",
        input: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        options: { codemode: false },
        execute: async () => {
          const examplesDirectory = join(projectRoot, "examples")

          let entries: Dirent[]
          try {
            entries = await readdir(examplesDirectory, { withFileTypes: true })
          } catch (error) {
            return {
              content: JSON.stringify({
                error: `failed to read examples directory: ${(error as Error).message}`,
              }),
            }
          }

          const names = entries
            .filter((entry) => entry.isFile() && entry.name.endsWith(".slop"))
            .map((entry) => entry.name)
            .sort()

          const examples: ExampleOutput[] = []
          for (const name of names) {
            try {
              const result = await execute(
                "uv",
                ["run", "--no-active", "sloperator.py", join(examplesDirectory, name)],
                projectRoot,
              )
              examples.push({
                name,
                exitCode: result.exitCode,
                firstLine: firstLine(result.stdout),
              })
            } catch (error) {
              return {
                content: JSON.stringify({
                  error: `failed to run ${name}: ${(error as Error).message}`,
                }),
              }
            }
          }

          return { content: JSON.stringify({ examples }) }
        },
      })
    })
  },
})
