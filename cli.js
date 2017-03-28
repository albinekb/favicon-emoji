#!/usr/bin/env node
const args = require('args')
const opn = require('opn')
const path = require('path')
const fsp = require('fs-promise')
const emojis = require('emoji-img')

args
  .option('emoji', 'choose emoji', 'palm-tree')
  .option('destination', 'favicon destination', './favicon.ico')
  .option('list', 'show list of available emojis')

const flags = args.parse(process.argv)

if (flags.list) {
  opn('https://www.webpagefx.com/tools/emoji-cheat-sheet/')
  console.log('🕸 Opened emoji cheat sheet in browser')
  process.exit(0)
}

if (!flags.emoji) throw new Error('No emoji specified')
if (!flags.destination) throw new Error('No destination specified')

if (flags.emoji.includes('-')) flags.emoji = flags.emoji.replace(/-/g, '_')
if (flags.emoji.includes(':')) throw new Error('Please specify emoji without :')
if (!emojis.has(flags.emoji)) throw new Error(`Emoji ${flags.emoji} not found`)

const dest = path.resolve(flags.destination)

Promise.resolve(emojis.get(flags.emoji))
  .then(path => fsp.copy(path, dest))
  .then(() => console.log('✨ Done, emoji favicon saved to', dest))
  .catch(error => console.error('error', error))
