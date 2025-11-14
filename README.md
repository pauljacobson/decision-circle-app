# decision-circle-app
A small side project to build a decision circle app with Claude Code

## Generate .gitignore

This project includes a TypeScript React (.tsx) script that generates a comprehensive .gitignore file for Node.js, TypeScript, and React projects.

### Usage

To generate or regenerate the .gitignore file:

```bash
npm run generate:gitignore
```

This will create a `.gitignore` file in the project root with appropriate ignore patterns for:
- Node.js dependencies
- Build outputs
- TypeScript artifacts
- Environment variables
- Editor files
- Testing coverage
- Logs
- Temporary files
- OS-specific files
- React-specific files

### Customization

To customize the .gitignore patterns, edit the `gitignoreConfig` array in `generate-gitignore.tsx`.
