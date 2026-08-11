# BAES Website — Parallel Agents via Git Worktrees

Context: follows the project handoff, fixtures handoff, and CMS handoff docs.
This covers running two (or more) Claude Code sessions on the same repo at
once, without them overwriting each other's work.

## Why worktrees, not just two terminal windows
Two Claude Code sessions pointed at the same folder edit the same files on
disk — they'll overwrite each other's changes and each lose track of what
the other has done. A git worktree gives each session its own separate
folder, checked out to its own branch, while still being part of the same
repo and shared history.

## Current state before starting
- Main repo: `C:\Users\j_hud\Documents\BAES-Website`
- Remote: `https://github.com/British-Army-Esports/BAES-Website.git`
- Astro scaffold in place, Decap CMS config and fixtures data are the two
  pending pieces of work

## Splitting the work — what's safe to parallelise
These two tasks barely touch the same files, so they're a clean split:
1. **Decap CMS setup** — `/public/admin/index.html`, `/public/admin/config.yml`
2. **Fixtures/events content** — creating entries in `/src/content/events/`
   using the verified dates from the fixtures handoff doc

**Do not parallelise anything that touches the core Events schema itself**
(`src/content/config.ts`) — both tasks above depend on that being stable.
If schema changes are still needed, do those single-threaded first, then
branch off into worktrees for the CMS and content work.

## Setup steps

From inside your main repo folder:

```
cd C:\Users\j_hud\Documents\BAES-Website

# Create a worktree + branch for CMS setup
git worktree add ../BAES-Website-cms feature/cms-setup

# Create a worktree + branch for fixtures content
git worktree add ../BAES-Website-fixtures feature/fixtures-data
```

This creates two sibling folders next to your main one:
```
Documents/
  BAES-Website/            ← main, keep this as your "review and merge" copy
  BAES-Website-cms/         ← worktree, branch: feature/cms-setup
  BAES-Website-fixtures/    ← worktree, branch: feature/fixtures-data
```

Each is a full working copy — `npm install` will need to be run separately
in each one, since `node_modules` isn't shared across worktrees.

## Running the two agents
- Open one Claude Code session with working directory
  `BAES-Website-cms` → hand it the CMS handoff doc, tell it to work on
  `feature/cms-setup`
- Open a second Claude Code session with working directory
  `BAES-Website-fixtures` → hand it the fixtures handoff doc, tell it to
  work on `feature/fixtures-data`
- They're now genuinely isolated — neither can see or overwrite the other's
  in-progress changes

## Merging the work back in
Once an agent finishes a piece of work:

```
cd C:\Users\j_hud\Documents\BAES-Website
git checkout main
git pull
git merge feature/cms-setup
git push
```

Review the diff before merging if you want a check-step — `git log
feature/cms-setup` or just open the files in the worktree folder to see what
changed.

Repeat for `feature/fixtures-data` once that's ready too. Merge one at a
time rather than both simultaneously, so if there's a conflict you're only
resolving one at a time.

## Cleaning up after merging
Once a branch is merged into `main` and you don't need the worktree anymore:

```
git worktree remove ../BAES-Website-cms
git branch -d feature/cms-setup
```

Repeat for the fixtures worktree. Worktrees left lying around after their
branch is merged just clutter the folder — worth cleaning up each time
rather than letting them accumulate.

## Quick reference — check what worktrees exist
```
git worktree list
```
Shows every worktree currently attached to the repo, and which branch each
one is on — useful if you lose track of what's running where.

## Next steps
1. Decide whether any Events schema changes are still outstanding — do
   those first, single-threaded, before branching
2. Run the two `git worktree add` commands above
3. Open a Claude Code session in each new folder, feed each the relevant
   earlier handoff doc (CMS handoff → `BAES-Website-cms`; fixtures handoff →
   `BAES-Website-fixtures`)
4. Merge each branch back into `main` as it completes, one at a time
5. Clean up worktrees once merged
