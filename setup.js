#!/usr/bin/env node

import { promises as fs } from 'fs'

import inquirer from 'inquirer'
import { replaceInFileSync } from 'replace-in-file'

async function main() {
  console.info('\n========== 🚀 VTEX IO App Template Setup ==========\n')

  const data = await fs.readFile('.setuprc', 'utf8').catch((e) => {
    if (e.code !== 'ENOENT') throw e
  })

  const settings = data ? JSON.parse(data) : {}

  const answers = await inquirer.prompt([
    {
      type: 'input',
      when: !settings.appName,
      name: 'appName',
      message: 'What is the app name?',
      validate: (input) => (input ? true : 'App name cannot be empty!'),
    },
    {
      type: 'input',
      when: !settings.appVendor,
      name: 'appVendor',
      message: 'What is the app vendor?',
      default: 'ssesandbox04',
      validate: (input) => (input ? true : 'App vendor cannot be empty!'),
    },
    {
      type: 'input',
      when: !settings.appTitle,
      name: 'appTitle',
      message: 'What is the app title?',
      validate: (input) => (input ? true : 'App title cannot be empty!'),
    },
    {
      type: 'input',
      when: !settings.appDescription,
      name: 'appDescription',
      message: 'What is the app description?',
    },
  ])

  const appName = (answers.appName || settings.appName).trim()
  const appVendor = (answers.appVendor || settings.appVendor).trim()
  const appTitle = (answers.appTitle || settings.appTitle).trim()
  const appDescription = (
    answers.appDescription ||
    settings.appDescription ||
    ''
  ).trim()

  const options = {
    files: ['**/*.{json,md,ts,tsx}', '.all-contributorsrc'],
    ignore: '**/node_modules/**',
    from: [
      /<APP_NAME>/g,
      /<APP_VENDOR>/g,
      /<APP_TITLE>/g,
      /<APP_DESCRIPTION>/g,
    ],
    to: [
      appName,
      appVendor,
      appTitle,
      appDescription.endsWith('.') || !appDescription
        ? appDescription
        : `${appDescription}.`,
    ],
  }

  const results = replaceInFileSync(options)

  const changedFiles = results.filter((r) => r.hasChanged).map((r) => r.file)

  if (changedFiles.length) {
    console.info('\n✅ Replacements have occurred in the files:')
    changedFiles.forEach((file) => console.info(`  - ${file}`))
  } else {
    console.info('⚠️ No replacements occurred.')
  }

  await fs.writeFile(
    '.setuprc',
    JSON.stringify({ appName, appVendor, appTitle, appDescription }, null, 2)
  )

  console.info('\n🎉 Setup completed!\n')
}

main().catch((error) => {
  console.error('❌ An error occurred while setting up:', error)
})
