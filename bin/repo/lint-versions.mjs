import { readFileSync } from 'fs';

function checkVersions(packageJsonPath) {
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const allDependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const flexibleVersionPattern = /^[\^~><=]/;
    let hasFlexibleVersions = false;

    for (const [packageName, version] of Object.entries(allDependencies)) {
      if (flexibleVersionPattern.test(version)) {
        console.error(`Flexible version found: ${packageName} - ${version}`);
        hasFlexibleVersions = true;
      }
    }

    return hasFlexibleVersions ? 1 : 0;
  } catch (error) {
    console.error(`Error reading or parsing ${packageJsonPath}:`, error);
    return 1;
  }
}

const result = checkVersions('package.json');
process.exit(result);
