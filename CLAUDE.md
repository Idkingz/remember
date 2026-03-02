# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`remember` is a Node.js CLI tool that saves and retrieves content using keywords, stored in `~/.remember/`.

**Usage:**
- `remember path/to/file keyword` — copies the file to `~/.remember/keyword`
- `remember "Some text" keyword` — saves the text to `~/.remember/keyword`
- `remember keyword` — retrieves and prints the content saved under that keyword

## Commands

```bash
# Install dependencies
npm install

# Install globally (enables the `remember` command system-wide)
npm install -g .

# Run directly without installing
node bin/remember.js "Some text" mykey
node bin/remember.js path/to/file mykey
node bin/remember.js mykey
```

## Using the CLI

After installing globally (`npm install -g .`), use the `remember` command:

```bash
# Save a text snippet under a keyword
remember "my api key is abc123" apikey

# Save a file under a keyword
remember ~/.ssh/config sshconfig
remember path/to/notes.txt notes

# Retrieve saved content by keyword
remember apikey
remember notes

# Show help
remember --help
```

Saved entries are stored as plain files in `~/.remember/` and can also be read, edited, or deleted directly:

```bash
ls ~/.remember/           # list all saved keywords
cat ~/.remember/apikey    # read an entry directly
rm ~/.remember/apikey     # delete an entry
```

## Architecture

### Files
- `package.json` — declares `bin: { "remember": "./bin/remember.js" }`, no external dependencies
- `bin/remember.js` — single entry point with `#!/usr/bin/env node`

### Logic in `bin/remember.js`

Dispatch by argument count:

**2 args → save mode** (`remember <content-or-file> <keyword>`)
1. Ensure `~/.remember/` exists (create with `fs.mkdirSync` if needed)
2. If arg1 resolves to an existing path on disk (`fs.existsSync`): copy file to `~/.remember/<keyword>`
3. Otherwise: write arg1 as text to `~/.remember/<keyword>`
4. Print confirmation: `Saved as "<keyword>"`

**1 arg → retrieve mode** (`remember <keyword>`)
1. Read `~/.remember/<keyword>`
2. Print contents to stdout
3. If not found: print error and exit with code 1

**0 args or wrong count → usage**
- Print usage instructions and exit with code 1

## Dependencies

- [`commander`](https://www.npmjs.com/package/commander) — CLI argument parsing and `--help` generation
- [`vitest`](https://vitest.dev/) — test framework (dev dependency)
- Node.js builtins: `fs`, `path`, `os`

## Publishing to npm

Ensure `package.json` has these fields set correctly before publishing:
- `name` — must be unique on npm (e.g. `@username/remember` for a scoped package)
- `version` — follow semver
- `bin: { "remember": "./bin/remember.js" }` — registers the CLI command
- `files: ["bin/"]` — only ships the binary, excludes tests and dev files
- `engines: { "node": ">=18" }` — declare minimum Node.js version

The entry point must be executable and have the shebang:
```js
#!/usr/bin/env node
```

```bash
# One-time setup
npm login

# Publish
npm publish

# For scoped packages (public)
npm publish --access public
```

## Testing

```bash
npm test
```

Tests live in `test/` and cover:
- Saving text with a keyword → file created in `~/.remember/<keyword>`
- Saving a file with a keyword → file copied to `~/.remember/<keyword>`
- Retrieving by keyword → correct content printed to stdout
- Error cases: unknown keyword, missing arguments

Tests use a temp directory instead of the real `~/.remember/` to avoid side effects.
