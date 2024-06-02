import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Utility to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};

  args.forEach((arg, index) => {
    if (arg.startsWith('--')) {
      const key = arg.substring(2);
      const value = args[index + 1];
      params[key] = value;
    }
  });

  return params;
}

// Function to read and parse .gitignore
function parseGitignore(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').filter(Boolean).map(pattern => pattern.trim());
}

// Function to check if a file should be ignored
function isIgnored(file, ignorePatterns) {
  return ignorePatterns.some(pattern => new RegExp(pattern).test(file));
}

const params = parseArgs();
const directoryPath = params.directory || 'project'; // Default to 'project' if not provided
const outputFile = params.output || 'output.md'; // Default to 'output.md' if not provided

const gitignorePath = path.join(__dirname, '.gitignore');
const ignorePatterns = parseGitignore(gitignorePath);

// Adding package.json and package-lock.json to ignore patterns
ignorePatterns.push('package.json', 'package-lock.json');

// Function to read directory recursively
function readDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readDirectory(filePath, fileList);
    } else if (!isIgnored(filePath, ignorePatterns)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to generate markdown content
function generateMarkdownContent(files) {
  let markdownContent = '';

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    markdownContent += `\n${file}\n\n\`\`\`js\n${content}\n\`\`\`\n`;
  });

  return markdownContent;
}

// Main function to create markdown file
function createMarkdownFile() {
  const files = readDirectory(directoryPath);
  const markdownContent = generateMarkdownContent(files);

  fs.writeFileSync(outputFile, markdownContent, 'utf-8');
  console.log(`Markdown file created at ${outputFile}`);
}

createMarkdownFile();
