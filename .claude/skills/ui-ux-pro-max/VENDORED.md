# Vendored copy

Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT, see LICENSE)
Path upstream: `.claude/skills/ui-ux-pro-max/`
Upstream commit: e59ff37 (2026-11-16)

Local change: `SKILL.md` calls the search script as
`.claude/skills/ui-ux-pro-max/scripts/search.py` (run from the repo root)
instead of `${CLAUDE_PLUGIN_ROOT}/...`, because this copy is loaded as a
project skill, not a plugin. Re-apply that edit if you update from upstream.
