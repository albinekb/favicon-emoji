const dataURLToBuffer = require('data-uri-to-buffer')
const puppeteer = require('puppeteer')
const renderTextToDataURL = require('./browser')

/**
 * @param {string} text
 * @param {number[]} sizes
 */
module.exports = async (text, sizes) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  let dataURLs = []
  for (const size of sizes) {
    dataURLs.push(await page.evaluate(renderTextToDataURL, { text, size }))
  }

  await browser.close()

  return dataURLs.map(url => dataURLToBuffer(url))
}
