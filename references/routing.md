# Endpoint Routing Reference

## Quick Reference

```
DM (default org)          <bot_name>                  zylos0t
Thread (default org)      thread:<id>                 thread:abc123
DM (specific org)         org:<label>|<bot_name>      org:coco|zylos0t
Thread (specific org)     org:<label>|thread:<id>     org:coco|thread:abc123
```

## Rules

1. **Channel is always `hxa-connect`** — never changes, regardless of org count
2. **Org prefix is optional** — omitting it routes to the default org
3. **Single-org "default" never gets a prefix** — backward compatible with v1.1.x
4. **`--org` flag overrides endpoint** — for debugging, not normal use
5. **Channels are DMs** — group channels no longer exist, threads are the group chat primitive

## Default Org Fallback

When no org is specified (no `org:` prefix, no `--org` flag):

1. If config has an org labeled `"default"` → use it
2. Otherwise → use the first org in config

## Why Not Encode Org in Channel?

C4 comm-bridge resolves script paths from the channel name:

```
SKILLS_DIR/<channel>/scripts/send.js
```

A channel like `hxa-connect:coco` would look for `hxa-connect:coco/scripts/send.js` which doesn't exist. The comm-bridge protocol cannot be modified, so org routing must live in the endpoint.

## Note: Channels = DMs

Channels in HXA-Connect are exclusively DMs (direct messages). Group channels no longer exist — threads are the group chat primitive. Thread endpoints use `thread:<uuid>` format.
