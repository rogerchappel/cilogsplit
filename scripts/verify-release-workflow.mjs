import { readFile } from 'node:fs/promises';

const workflowUrl = new URL('../.github/workflows/release.yml', import.meta.url);
const dryRunWorkflowUrl = new URL('../.github/workflows/release-dry-run.yml', import.meta.url);
const workflow = await readFile(workflowUrl, 'utf8');
const dryRunWorkflow = await readFile(dryRunWorkflowUrl, 'utf8');

const minimumTrustedPublishingNpm = [11, 5, 1];

function compareVersions(left, right) {
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

function verifyReleaseWorkflow(source) {
  const failures = [];
  const npmInstallMatch = source.match(/npm install --global npm@(\d+)\.(\d+)\.(\d+)/);
  const npmInstallIndex = npmInstallMatch?.index ?? -1;
  const dependencyInstallIndex = source.indexOf('npm ci');
  const releaseChecksIndex = source.indexOf('npm run release:check');
  const publishIndex = source.indexOf('npm publish *.tgz --provenance --access public');
  const releaseIndex = source.indexOf('gh release create');

  if (!/^permissions:\n  contents: read$/m.test(source)) {
    failures.push('workflow-level permissions must default contents to read');
  }
  if (!/^    permissions:\n      contents: write\n      id-token: write$/m.test(source)) {
    failures.push('release job must explicitly grant contents: write and id-token: write');
  }
  if (!/^          registry-url: https:\/\/registry\.npmjs\.org$/m.test(source)) {
    failures.push('setup-node must configure the public npm registry');
  }
  if (!npmInstallMatch) {
    failures.push('workflow must install an exactly pinned npm CLI version');
  } else if (
    compareVersions(npmInstallMatch.slice(1).map(Number), minimumTrustedPublishingNpm) < 0
  ) {
    failures.push('workflow npm CLI must support trusted publishing (11.5.1 or later)');
  }
  if (
    npmInstallIndex === -1 ||
    (dependencyInstallIndex !== -1 && npmInstallIndex > dependencyInstallIndex) ||
    (releaseChecksIndex !== -1 && npmInstallIndex > releaseChecksIndex) ||
    (publishIndex !== -1 && npmInstallIndex > publishIndex)
  ) {
    failures.push('supported npm CLI must be installed before dependencies, release checks, and publish');
  }
  if (publishIndex === -1) {
    failures.push('packed artifact must be published with provenance and public access');
  }
  if (releaseIndex === -1 || publishIndex > releaseIndex) {
    failures.push('npm publication must happen before GitHub release creation');
  }
  if (/NODE_AUTH_TOKEN/.test(source)) {
    failures.push('trusted publishing must not depend on a long-lived npm token');
  }

  if (failures.length > 0) {
    throw new Error(failures.join('; '));
  }
}

verifyReleaseWorkflow(workflow);

function verifyDryRunWorkflow(source) {
  const failures = [];
  const npmInstallMatch = source.match(/npm install --global npm@(\d+)\.(\d+)\.(\d+)/);
  const npmInstallIndex = npmInstallMatch?.index ?? -1;
  const dependencyInstallIndex = source.indexOf('npm ci');
  const releaseChecksIndex = source.indexOf('npm run release:check');

  if (!npmInstallMatch) {
    failures.push('dry-run workflow must install an exactly pinned npm CLI version');
  } else if (
    compareVersions(npmInstallMatch.slice(1).map(Number), minimumTrustedPublishingNpm) < 0
  ) {
    failures.push('dry-run npm CLI must support trusted publishing (11.5.1 or later)');
  }
  if (
    npmInstallIndex === -1 ||
    (dependencyInstallIndex !== -1 && npmInstallIndex > dependencyInstallIndex) ||
    (releaseChecksIndex !== -1 && npmInstallIndex > releaseChecksIndex)
  ) {
    failures.push('dry-run npm CLI must be installed before dependencies and release checks');
  }

  if (failures.length > 0) throw new Error(failures.join('; '));
}

verifyDryRunWorkflow(dryRunWorkflow);

const reversed = workflow.replace(
  /(      - name: Publish to npm[\s\S]*?)(      - name: Create GitHub release[\s\S]*)/,
  '$2$1',
);
try {
  verifyReleaseWorkflow(reversed);
  throw new Error('release contract accepted a fixture that publishes after GitHub release creation');
} catch (error) {
  if (error.message.startsWith('release contract accepted')) throw error;
}

for (const [description, fixture] of [
  ['missing npm install', workflow.replace(/^      - name: Install trusted publishing npm CLI\n        run: npm install --global npm@11\.5\.1\n/m, '')],
  ['old npm install', workflow.replace('npm@11.5.1', 'npm@11.5.0')],
  ['mutable npm install', workflow.replace('npm@11.5.1', 'npm@latest')],
  [
    'late npm install',
    workflow.replace(
      /(      - name: Install trusted publishing npm CLI\n        run: npm install --global npm@11\.5\.1\n)(      - name: Install dependencies\n        run: npm ci\n)/,
      '$2$1',
    ),
  ],
]) {
  try {
    verifyReleaseWorkflow(fixture);
    throw new Error(`release contract accepted fixture: ${description}`);
  } catch (error) {
    if (error.message.startsWith('release contract accepted')) throw error;
  }
}

console.log('verified pinned npm trusted publishing prerequisite and release ordering');
