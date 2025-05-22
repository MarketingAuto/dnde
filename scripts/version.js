const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json files
const rootPackagePath = path.join(__dirname, '..', 'package.json');
const modulePackagePath = path.join(__dirname, '..', 'module-package.json');

const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const modulePackage = JSON.parse(fs.readFileSync(modulePackagePath, 'utf8'));

// Get the new version from standard-version
const newVersion = execSync('npx standard-version --dry-run --skip-git --skip-changelog')
  .toString()
  .match(/tagging release v(.+)/)[1];

// Update versions in both package.json files
rootPackage.version = newVersion;
modulePackage.version = newVersion;

// Write back the updated package.json files
fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n');
fs.writeFileSync(modulePackagePath, JSON.stringify(modulePackage, null, 2) + '\n');

// Run standard-version for real
execSync('npx standard-version --skip-git', { stdio: 'inherit' });

console.log(`Version updated to ${newVersion} in both package.json files`); 