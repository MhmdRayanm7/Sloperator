---
description: Stage relevant changes, commit with the given message, then rebase onto origin/main
agent: build
---

Commit the current work with this message:

$ARGUMENTS

If the message above is empty, stop and ask for a commit message. Do not invent one.
Follow these steps in order, and stop immediately if any command fails or shows a
conflict. Never force, rewrite history, or bypass hooks.

## 1. Inspect the working tree

- Run `git status --short --branch`.
- Review unstaged changes with `git diff` and already-staged changes with `git diff --cached`.
- Review the overall scope with `git diff --stat` and list untracked files.

Identify and exclude:

- Secrets and credentials: `.env` files, private keys, tokens, auth configs, and any
  file containing a credential.
- Unrelated changes: generated files, build output, caches, `node_modules`, editor or
  OS files, and anything not needed for this change.

## 2. Stage only relevant project changes

- Stage explicit paths with `git add -- <path> ...`.
- Never use `git add -A`, `git add .`, or `git add --all`.
- If previously staged files are unrelated, unstage them with
  `git restore --staged <path>` (do not discard their contents).
- Do not edit file contents as part of staging.

## 3. Show the staged diff and wait for approval

- Run `git diff --cached --stat` and `git diff --cached`.
- Verify the staged set contains only relevant files and no secrets.
- Show the user the staged file list and the full staged diff, then stop and wait for
  explicit approval. Do not commit until the user approves.
- If the user asks for changes, adjust the staging and show the diff again.

## 4. Commit

- Commit with `git commit -m "$ARGUMENTS"`, using the message exactly as provided.
  Do not amend and do not add attribution or co-author lines.
- Then run `git status --short --branch` and `git log -1 --oneline` and report the
  result.

## 5. Rebase onto main

- Run `git pull --rebase origin main`.
- If it reports a conflict or any error, stop immediately. Do not run
  `git rebase --continue`, `--skip`, or `--abort`, and do not reset or force anything.
  Report the exact error and the conflicted files from `git status`, and tell the user
  what needs resolving.
- On success, report whether new commits were pulled, the new HEAD from
  `git log -1 --oneline`, and `git status --short --branch`.

Do not push. Do not use any force option, `git reset --hard`, `git clean`, or other
destructive or history-rewriting commands.
