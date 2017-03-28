#!/usr/bin/env node
const args = require('args')
const path = require('path')
const fsp = require('fs-promise')
const emojis = require('emoji-img')

args
  .option('emoji', 'choose emoji', 'palm-tree')
  .option('destination', 'destination', './favicon.ico')

const flags = args.parse(process.argv)

if (flags.emoji && flags.emoji.includes('-')) flags.emoji = flags.emoji.replace(/-/g, '_')

if (!flags.emoji) throw new Error('No emoji specified')
if (!flags.destination) throw new Error('No destination specified')
if (!emojis.has(flags.emoji)) throw new Error(`Emoji ${flags.emoji} not found`)

const dest = path.resolve(flags.destination)

console.log(flags.emoji)
Promise.resolve(emojis.get(flags.emoji))
  .then(path => fsp.copy(path, dest))
  .then(() => console.log('✨ Done, emoji favicon saved to', dest))
  .catch(error => console.error('error', error))
