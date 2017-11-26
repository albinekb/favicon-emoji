#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const emojilib = require('emojilib')
const neodoc = require('neodoc')
const toIco = require('to-ico')

const render = require('./lib/render')

function findEmoji (input) {
  if (/^[a-z0-9:_-]+$/.test(input)) {
    const id = (input.startsWith(':') && input.endsWith(':') ? input.slice(1, -1) : input)

    if (!emojilib.lib[id]) {
      throw new Error(`Unknown emoji "${id}"`)
    }

    return emojilib.lib[id].char
  }

  return input
}

const usage = `
🌴 favicon-emoji

Usage:
  favicon-emoji [options]

Options:
  -d, --destination <value>  favicon destination     [default: "./favicon.ico"]
  -e, --emoji <value>        choose emoji            [default: "✨"]
  -m, --minimum              create favicon with selected sizes (16x16, 32x32, 48x48)
  -h, --help                 Output usage information
  -l, --list                 show list of available emojis
  -p, --png <value>          png output path         [default: "./favicon.png"]
  -v, --version              Output the version number
`

const args = neodoc.run(usage)

if (args['--list']) {
  require('opn')('https://www.webpagefx.com/tools/emoji-cheat-sheet/')
  console.log('🕸 Opened emoji cheat sheet in browser')
  process.exit(0)
}

if (args['--emoji'] && args['--destination']) {
  const dest = path.resolve(args['--destination'])
  const pngDest = path.resolve(args['--png'])
  const emoji = findEmoji(args['--emoji'])
  const sizes = args['--minimum'] ? [16, 32, 48] : [16, 32, 48, 64, 128, 256]

  const start = Date.now()
  const hrstart = process.hrtime()
  Promise.resolve(emoji)
    .then(char => render(char, sizes))
    .then(images => {
      if (pngDest) fs.writeFileSync(pngDest, images[images.length - 1])
      return images
    })
    .then(images => toIco(images, {sizes}))
    .then(buf => fs.writeFileSync(dest, buf))
    .then(() => {
      const end = Date.now() - start
      const hrend = process.hrtime(hrstart)

      console.log(`
Saved favicon.ico and favicon.png
${dest}
${pngDest}
Execution time: ${end / 1000}s
Execution time (hr): ${hrend[0]}s ${hrend[1] / 1000000}ms
    `)
    })
}
