// Compares package.json's version against what's actually live on npm.
// Exits non-zero (failing the CI job) if package.json has fallen behind the
// published version — the exact drift that left this repo publishing nothing
// for months. Otherwise reports whether the local version is ahead, so the
// publish workflow knows whether there's anything new to release.
import { execSync } from "node:child_process";
import { readFileSync, appendFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const local = pkg.version;

function parse(version) {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Cannot parse version "${version}" as major.minor.patch`);
  }
  return parts;
}

function compare(a, b) {
  const [aMajor, aMinor, aPatch] = parse(a);
  const [bMajor, bMinor, bPatch] = parse(b);
  return (aMajor - bMajor) || (aMinor - bMinor) || (aPatch - bPatch);
}

let published = "0.0.0";
try {
  published = execSync(`npm view ${pkg.name} version`, { encoding: "utf8" }).trim();
} catch {
  // Package has never been published; treat as version 0.0.0 so any local version publishes.
}

console.log(`local version:     ${local}`);
console.log(`published version: ${published}`);

const cmp = compare(local, published);

if (cmp < 0) {
  console.error(
    `package.json version (${local}) is behind the published version (${published}). ` +
    `Bump the version in package.json before merging to main.`
  );
  process.exit(1);
}

const shouldPublish = cmp > 0;
console.log(`should publish: ${shouldPublish}`);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `should_publish=${shouldPublish}\n`);
}
