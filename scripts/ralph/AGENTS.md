# Ralph Agent Instructions (Claude Code Edition)

## Overview

Ralph is an autonomous AI agent loop that runs Claude Code repeatedly until all PRD items are complete. Each iteration is a fresh Claude instance with clean context.

Adapted from [snarktank/ralph](https://github.com/snarktank/ralph) for use with Claude Code CLI.

## Commands

```bash
# Run Ralph (from project root)
./scripts/ralph/ralph.sh [max_iterations]

# Default is 10 iterations
./scripts/ralph/ralph.sh

# Run with more iterations
./scripts/ralph/ralph.sh 20
```

## Key Files

- `ralph.sh` - The bash loop that spawns fresh Claude instances
- `prompt.md` - Instructions given to each Claude instance
- `prd.json` - Your Product Requirements Document (create from prd.json.example)
- `progress.txt` - Cumulative log of what each iteration accomplished
- `prd.json.example` - Example PRD format

## How to Use

1. **Create a PRD**: Copy `prd.json.example` to `prd.json` and customize with your user stories
2. **Size stories correctly**: Each story should be completable in one context window
3. **Run Ralph**: `./scripts/ralph/ralph.sh`
4. **Monitor progress**: Check `progress.txt` and git history

## PRD Format

```json
{
  "project": "MyProject",
  "branchName": "ralph/feature-name",
  "description": "Brief description of the feature",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short title",
      "description": "User story description",
      "acceptanceCriteria": ["Criterion 1", "Criterion 2"],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

## Patterns

- Each iteration spawns a fresh Claude instance with clean context
- Memory persists via git history, `progress.txt`, and `prd.json`
- Stories should be small enough to complete in one context window
- Always update AGENTS.md with discovered patterns for future iterations
- Build must pass (`npm run build`) before committing
