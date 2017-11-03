module.exports = async function renderTextToDataURL ({ text, size }) {
  const createCanvas = size =>
    Object.assign(document.createElement('canvas'), {
      width: size,
      height: size
    })
  const canvas = createCanvas(size * 2)
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = `${size}px Apple Color Emoji`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, size * 2 / 2, size * 2 / 2)

  const trimCanvas = canvas => {
    const rowBlank = (imageData, width, y) => {
      for (let x = 0; x < width; ++x) {
        if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false
      }
      return true
    }

    const columnBlank = (imageData, width, x, top, bottom) => {
      for (let y = top; y < bottom; ++y) {
        if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false
      }
      return true
    }

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    let top = 0
    let bottom = imageData.height
    let left = 0
    let right = imageData.width

    while (top < bottom && rowBlank(imageData, width, top)) {
      ++top
    }
    while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) {
      --bottom
    }
    while (left < right && columnBlank(imageData, width, left, top, bottom)) {
      ++left
    }
    while (
      right - 1 > left &&
      columnBlank(imageData, width, right - 1, top, bottom)
    ) {
      --right
    }

    const trimmed = ctx.getImageData(left, top, right - left, bottom - top)
    const max = Math.max(trimmed.width, trimmed.height)

    const copy = Object.assign(document.createElement('canvas'), {
      width: max,
      height: max
    })

    const copyCtx = copy.getContext('2d')

    copyCtx.putImageData(
      trimmed,
      (max - trimmed.width) / 2,
      (max - trimmed.height) / 2
    )

    return copy
  }

  return trimCanvas(canvas).toDataURL('image/png')
}
