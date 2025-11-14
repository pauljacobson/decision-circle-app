import * as fs from 'fs';
import * as path from 'path';
import React from 'react';

/**
 * Interface for gitignore sections
 */
interface GitignoreSection {
  title: string;
  patterns: string[];
}

/**
 * Gitignore configuration defined using TypeScript data structure
 * This demonstrates using .tsx for configuration with type safety
 */
const gitignoreConfig: GitignoreSection[] = [
  {
    title: 'Node.js dependencies',
    patterns: [
      'node_modules/',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',
      'lerna-debug.log*'
    ]
  },
  {
    title: 'Build outputs',
    patterns: [
      'dist/',
      'build/',
      'out/',
      '.next/',
      '.nuxt/',
      '.cache/',
      '.parcel-cache/'
    ]
  },
  {
    title: 'TypeScript',
    patterns: [
      '*.tsbuildinfo'
    ]
  },
  {
    title: 'Environment variables',
    patterns: [
      '.env',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local'
    ]
  },
  {
    title: 'Editor directories and files',
    patterns: [
      '.vscode/*',
      '!.vscode/extensions.json',
      '.idea/',
      '.DS_Store',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?'
    ]
  },
  {
    title: 'Testing',
    patterns: [
      'coverage/',
      '.nyc_output/'
    ]
  },
  {
    title: 'Logs',
    patterns: [
      'logs/',
      '*.log'
    ]
  },
  {
    title: 'Temporary files',
    patterns: [
      '*.tmp',
      '*.temp',
      '.tmp/',
      '.temp/'
    ]
  },
  {
    title: 'OS files',
    patterns: [
      'Thumbs.db',
      '.DS_Store'
    ]
  },
  {
    title: 'React specific',
    patterns: [
      '.eslintcache'
    ]
  }
];

/**
 * Component representing a single gitignore section
 * This is a React component that could be used in a UI if needed
 */
const GitignoreSectionComponent: React.FC<{ section: GitignoreSection }> = ({ section }) => {
  return (
    <div>
      <h3>{section.title}</h3>
      <ul>
        {section.patterns.map((pattern, index) => (
          <li key={index}>{pattern}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Main component that could display the gitignore configuration in a UI
 */
const GitignoreViewer: React.FC = () => {
  return (
    <div>
      <h2>Gitignore Configuration</h2>
      {gitignoreConfig.map((section, index) => (
        <GitignoreSectionComponent key={index} section={section} />
      ))}
    </div>
  );
};

/**
 * Generates the .gitignore file content from the configuration
 */
function renderGitignoreContent(): string {
  const lines: string[] = [];
  
  gitignoreConfig.forEach((section) => {
    lines.push(`# ${section.title}`);
    lines.push(...section.patterns);
    lines.push(''); // Empty line between sections
  });
  
  return lines.join('\n');
}

/**
 * Main function to generate the .gitignore file
 */
function generateGitignore(): void {
  const outputPath = path.join(process.cwd(), '.gitignore');
  const content = renderGitignoreContent();
  
  console.log('Generating .gitignore file...');
  console.log('Content:');
  console.log('---');
  console.log(content);
  console.log('---');
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`✓ .gitignore file created successfully at: ${outputPath}`);
}

// Run the generator
generateGitignore();
