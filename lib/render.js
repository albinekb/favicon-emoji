const dataURLToBuffer = require('data-uri-to-buffer')
const puppeteer = require('puppeteer')
const renderTextToDataURL = require('./browser')

module.exports = async (text, { size }) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const dataURL = await page.evaluate(renderTextToDataURL, { text, size })
  await browser.close()
  return dataURLToBuffer(dataURL)
}
