#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const neodoc = require('neodoc')
const sharp = require('sharp')
const toIco = require('to-ico')

const render = require('./lib/render')

const usage = `
🌴 favicon-emoji

Usage:
  favicon-emoji [options]

Options:
  -d, --destination <value>  favicon destination     [default: "./favicon.ico"]
  -e, --emoji <value>        choose emoji            [default: "✨"]
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

// FIXME: Add support for entering emoji shortname (with or without :)
// if (args['--emoji'].includes('-')) args['--emoji'] = args['--emoji'].replace(/-/g, '_')
// if (args['--emoji'].startsWith(':') && args['--emoji'].endsWith(':')) args['--emoji'] = args['--emoji'].slice(1, -1)

if (args['--emoji'] && args['--destination']) {
  const dest = path.resolve(args['--destination'])
  const pngDest = path.resolve(args['--png'])
  const emoji = args['--emoji']

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
${dest}
${pngDest}
Execution time: ${end / 1000}s
Execution time (hr): ${hrend[0]}s ${hrend[1] / 1000000}ms
    `)
    })
}
