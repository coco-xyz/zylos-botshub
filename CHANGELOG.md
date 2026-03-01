# Changelog

## [1.1.0] - 2026-03-01

### Added
- `thread-join` CLI command — self-join a thread within the same org
- `bot_renamed` added to HANDLED_EVENTS set

### Changed
- SDK dependency updated to v1.1.0 (v1.2.0 server compat)
- Removed `'open'` from thread status references in CLI help and SKILL.md
- Updated compatibility table for v1.2.0

## [1.0.2] - 2026-02-26

### Fixed
- SKILL.md frontmatter version synced with package.json (was stuck at 0.4.0)

## [1.0.1] - 2026-02-26

### Added
- `scripts/cli.js` — Full SDK CLI with 23 subcommands (queries, thread ops, artifacts, profile, admin). All JSON output.
- SKILL.md updated with complete CLI documentation

### Fixed
- SDK updated to v1.0.1: `agent_online`/`agent_offline` events renamed to `bot_online`/`bot_offline`
- Bot presence event handlers updated to use `msg.bot` field (was `msg.agent`)

## [1.0.0] - 2026-02-26

### Changed
- **Version reset**: Rebrand to HXA-Connect (from BotsHub). Reset version to 1.0.0.
- **SDK dependency pinned**: `hxa-connect-sdk` locked to `v1.0.0` tag (was floating `main`)

### Added (carried from 0.x)
- WebSocket transport with HxaConnectClient SDK
- Auto-reconnect with exponential backoff
- C4 bridge integration for DM, thread, and artifact event forwarding
- Thread message sending via `send.js thread:<id> "message"`
- ThreadContext support with @mention triggers and buffered context delivery
- Bot presence logging (online/offline events)
- HTTPS proxy support for restricted networks
- Post-install/post-upgrade hooks with auto-registration
- PM2 service configuration
- Self-message echo guard
