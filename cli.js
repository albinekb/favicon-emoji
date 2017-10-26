#!/usr/bin/env node
const args = require('args')
const path = require('path')
const emojis = require('emoji-img')

const fs = require('fs')
const { join } = require('path')
const toIco = require('to-ico')
const puppeteer = require('puppeteer')
const sharp = require('sharp')
const render = require('./lib/render')

args
  .option('emoji', 'choose emoji', 'palm-tree')
  .option('destination', 'favicon destination', './favicon.ico')
  .option('png', 'save png too', './favicon.png')
  .option('list', 'show list of available emojis')

const flags = args.parse(process.argv)
console.log('flags', flags)

if (flags.list) {
  require('opn')('https://www.webpagefx.com/tools/emoji-cheat-sheet/')
  console.log('🕸 Opened emoji cheat sheet in browser')
  process.exit(0)
}

if (!flags.emoji) throw new Error('No emoji specified')
if (!flags.destination) throw new Error('No destination specified')

if (flags.emoji.includes('-')) flags.emoji = flags.emoji.replace(/-/g, '_')
if (flags.emoji.includes(':')) throw new Error('Please specify emoji without :')
if (!emojis.has(flags.emoji)) throw new Error(`Emoji ${flags.emoji} not found`)

if (flags.emoji && flags.destination) {
  const dest = path.resolve(flags.destination)
  const pngDest = flags.png && path.resolve(flags.png)
  const fsp = require('fs-promise')
  const emoji = emojis.get(flags.emoji)

  const start = Date.now()
  const hrstart = process.hrtime()
  Promise.resolve(emoji)
    .then(char => render(char, { size: 256 }))
    .then(image => {
      if (pngDest) fs.writeFileSync(pngDest, image)
      return image
    })
    .then(image =>
      Promise.all(
        [16, 32, 48, 64, 128, 256].map(size =>
          sharp(image)
            .resize(size, size)
            .toBuffer(),
        ),
      ),
    )
    .then(images => toIco(images))
    .then(buf => fs.writeFileSync(dest, buf))
    .then(() => {
      const end = Date.now() - start
      const hrend = process.hrtime(hrstart)

      console.log(`
Saved favicon.ico and favicon.png
${join(process.cwd(), flags.destination)}
${pngDest ? pngDest : ''}
Execution time: ${end / 1000}s
Execution time (hr): ${hrend[0]}s ${hrend[1] / 1000000}ms
    `)
    })
}
