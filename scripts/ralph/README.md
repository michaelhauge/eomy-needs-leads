# Ralph (Claude Code Edition)

Ralph is an autonomous AI agent loop that runs Claude Code repeatedly until all PRD items are complete. Each iteration is a fresh Claude instance with clean context. Memory persists via git history, `progress.txt`, and `prd.json`.

Adapted from [snarktank/ralph](https://github.com/snarktank/ralph) for Claude Code CLI.

## Prerequisites

- Claude Code CLI (`claude` command) installed and authenticated
- `jq` installed (`brew install jq` on macOS)
- A git repository for your project

## Quick Start

```bash
# 1. Create your PRD (copy and edit the example)
cp scripts/ralph/prd.json.example scripts/ralph/prd.json

# 2. Edit prd.json with your user stories

# 3. Run Ralph
./scripts/ralph/ralph.sh
```

## Key Files

| File | Purpose |
|------|---------|
| `ralph.sh` | The bash loop that spawns fresh Claude instances |
| `prompt.md` | Instructions given to each Claude instance |
| `prd.json` | User stories with `passes` status (create from example) |
| `prd.json.example` | Example PRD format for reference |
| `progress.txt` | Append-only learnings for future iterations |
| `AGENTS.md` | Detailed documentation |

## How It Works

1. Ralph reads `prd.json` for incomplete user stories
2. Spawns a fresh Claude instance with instructions from `prompt.md`
3. Claude implements ONE story, runs `npm run build`, and commits
4. Updates `prd.json` to mark story as `passes: true`
5. Logs progress to `progress.txt`
6. Repeats until all stories pass or max iterations reached

## Critical Concepts

### Each Iteration = Fresh Context

Each iteration spawns a **new Claude instance** with clean context. The only memory between iterations is:
- Git history (commits from previous iterations)
- `progress.txt` (learnings and context)
- `prd.json` (which stories are done)

### Small Tasks

Each PRD item should be small enough to complete in one context window. If a task is too big, the LLM runs out of context before finishing.

Right-sized stories:
- Add a database column and migration
- Add a UI component to an existing page
- Update an API endpoint with new logic
- Add a filter dropdown to a list

Too big (split these):
- "Build the entire dashboard"
- "Add authentication"
- "Refactor the entire API"

### Stop Condition

When all stories have `passes: true`, Ralph outputs `<promise>COMPLETE</promise>` and the loop exits.

## Debugging

```bash
# See which stories are done
cat scripts/ralph/prd.json | jq '.userStories[] | {id, title, passes}'

# See learnings from previous iterations
cat scripts/ralph/progress.txt

# Check git history
git log --oneline -10
```

## References

- [Original Ralph by Geoffrey Huntley](https://ghuntley.com/ralph/)
- [snarktank/ralph on GitHub](https://github.com/snarktank/ralph)
