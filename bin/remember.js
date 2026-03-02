#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const os = require('os');

const STORE_DIR = path.join(os.homedir(), '.remember');

program
  .name('remember')
  .description('Save and retrieve content using keywords')
  .argument('[content-or-keyword]', 'content/file to save, or keyword to retrieve')
  .argument('[keyword]', 'keyword to save under')
  .action((contentOrKeyword, keyword) => {
    if (contentOrKeyword === undefined) {
      program.outputHelp();
      process.exit(1);
    }

    if (keyword !== undefined) {
      // 2-arg mode: save
      fs.mkdirSync(STORE_DIR, { recursive: true });
      const dest = path.join(STORE_DIR, keyword);

      if (fs.existsSync(contentOrKeyword)) {
        fs.copyFileSync(contentOrKeyword, dest);
      } else {
        fs.writeFileSync(dest, contentOrKeyword);
      }

      console.log(`Saved as "${keyword}"`);
    } else {
      // 1-arg mode: retrieve
      const src = path.join(STORE_DIR, contentOrKeyword);
      if (!fs.existsSync(src)) {
        console.error(`No entry found for "${contentOrKeyword}"`);
        process.exit(1);
      }
      process.stdout.write(fs.readFileSync(src, 'utf8'));
    }
  });

program.parse();
