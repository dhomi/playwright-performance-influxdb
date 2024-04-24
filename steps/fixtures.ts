import { test as base } from 'playwright-bdd';

export const test = base.extend<{ browserSpecificTest: void }>({
    browserSpecificTest: [async ({ $tags }, use, testInfo) => {
    if ($tags.includes('@firefox') && testInfo.project.name !== 'firefox') {
      testInfo.skip();
    }
    testInfo.snapshotSuffix = ''
    await use();
  }, { auto: true }],
});
