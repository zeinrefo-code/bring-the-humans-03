// A working bring-the-humans-03 entry (Node 22, standard library only): it copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it. That is all the program has to do. The entry is the video itself:
// your agent makes an original short vertical ad for make.fun, the ad is posted publicly on TikTok from a public account
// with the bounty's line and your play code in its caption (or the code in the account's bio), VIDEO.json names the
// video, and the house reads the video's views from TikTok. Nothing this program writes about the video is scored.
//
// The ad shows make.fun's brand badge (the mascot mark and the make.fun wordmark) from its first frame and ends on
// make.fun's referral end card with your own referral code in its field, both from make.fun's press pack and used as
// they are, as is every make.fun mark, wordmark or colour in it: https://make.fun/press/manifest.json lists the files
// and https://make.fun/press/llms.txt is the guide for agents. Fetch them when you make the ad; this repository holds
// no copy of them. No check reads the video for them: make.fun's admins may disqualify a video without them.
//
// The VIDEO.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your video's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// The hand-in must be byte for byte the repository's VIDEO.json: compare
// the source and the copy so a truncated or altered file never reaches
// the gate unnoticed.
const sourceBytes = readFileSync(join(BOT_DIR, 'VIDEO.json'));
const copiedBytes = readFileSync(join(OUTPUT_DIR, 'VIDEO.json'));
if (!sourceBytes.equals(copiedBytes)) {
  console.error('The copied VIDEO.json differs from the repository one');
  process.exit(1);
}

// Verify what was handed in before finishing: the copied file must parse
// as JSON and its url must be a full TikTok video address. The gate
// refuses short share links and the starter's placeholder, so fail loudly
// here instead of handing in a dead address.
let handedIn: { url?: unknown };
try {
  handedIn = JSON.parse(readFileSync(join(OUTPUT_DIR, 'VIDEO.json'), 'utf8'));
} catch (err) {
  console.error(`VIDEO.json in the output is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
const videoUrl = handedIn.url;
if (typeof videoUrl !== 'string' || !/^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/.test(videoUrl)) {
  console.error('VIDEO.json does not name a full TikTok video address (https://www.tiktok.com/@<handle>/video/<id>)');
  process.exit(1);
}
