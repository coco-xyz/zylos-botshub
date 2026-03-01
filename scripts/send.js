#!/usr/bin/env node
/**
 * zylos-hxa-connect send interface
 *
 * Usage:
 *   node send.js <to_agent> "<message>"          — Send DM (default org)
 *   node send.js thread:<thread_id> "<message>"   — Send thread message (default org)
 *   node send.js --org coco <to_agent> "<message>" — Send via specific org
 *
 * Called by C4 comm-bridge to send outbound messages via HXA-Connect SDK.
 *
 * C4 channel parsing:
 *   "hxa-connect"       → org label "default"
 *   "hxa-connect:coco"  → org label "coco"
 */

import { HxaConnectClient } from '@coco-xyz/hxa-connect-sdk';
import { migrateConfig, resolveOrgs, setupFetchProxy } from '../src/env.js';

const rawArgs = process.argv.slice(2);

let orgLabel = null;
const args = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--org' && i + 1 < rawArgs.length) {
    orgLabel = rawArgs[++i];
  } else if (rawArgs[i] === '--channel' && i + 1 < rawArgs.length) {
    const ch = rawArgs[++i];
    if (ch === 'hxa-connect') orgLabel = orgLabel || 'default';
    else if (ch.startsWith('hxa-connect:')) orgLabel = orgLabel || ch.slice('hxa-connect:'.length);
  } else {
    args.push(rawArgs[i]);
  }
}

if (args.length < 2) {
  console.error('Usage: node send.js [--org <label>] [--channel <c4_channel>] <to_agent|thread:id> "<message>"');
  process.exit(1);
}

const target = args[0];
const message = args.slice(1).join(' ');

const config = migrateConfig();
const resolved = resolveOrgs(config);
const orgLabels = Object.keys(resolved.orgs);

if (!orgLabel) {
  orgLabel = resolved.orgs.default ? 'default' : orgLabels[0];
}

const org = resolved.orgs[orgLabel];
if (!org) {
  console.error(`Error: org "${orgLabel}" not found. Available: ${orgLabels.join(', ')}`);
  process.exit(1);
}

if (!org.hubUrl) {
  console.error(`Error: no hub_url configured for org "${orgLabel}"`);
  process.exit(1);
}

await setupFetchProxy();

const client = new HxaConnectClient({
  url: org.hubUrl,
  token: org.agentToken,
  ...(org.orgId && { orgId: org.orgId }),
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function sendAsThread(threadId) {
  await client.sendThreadMessage(threadId, message);
  console.log(`Sent to thread ${threadId}: ${message.substring(0, 50)}...`);
}

async function sendAsDM(to) {
  await client.send(to, message);
  console.log(`Sent to ${to}: ${message.substring(0, 50)}...`);
}

try {
  if (target.startsWith('thread:')) {
    await sendAsThread(target.slice('thread:'.length));
  } else if (UUID_RE.test(target)) {
    try {
      await client.getThread(target);
      await sendAsThread(target);
    } catch (threadErr) {
      if (threadErr?.body?.code === 'NOT_FOUND' || threadErr?.status === 404) {
        await sendAsDM(target);
      } else {
        throw threadErr;
      }
    }
  } else {
    await sendAsDM(target);
  }
} catch (err) {
  console.error(`Error sending to ${target}: ${err.message}`);
  process.exit(1);
}
