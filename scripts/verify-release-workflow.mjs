import { readFile } from 'node:fs/promises';

const workflowUrl = new URL('../.github/workflows/release.yml', import.meta.url);
const workflow = await readFile(workflowUrl, 'utf8');

function verifyReleaseWorkflow(source) {
  const failures = [];
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

console.log('verified trusted npm publication precedes GitHub release creation');
