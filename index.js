const jimp = require('jimp')
const shell = require('shelljs')
const fs = require('fs')
const moment = require('moment-timezone')

const WIDTH = 53
const HEIGHT = 7
const MIN_COMMITS = 0
const MAX_COMMITS = 100
const LINES_PER_COMMIT = 100

const main = async () => {
  const [imagePath, outputPath, repoUrl] = process.argv.slice(2)
  if (!imagePath || !outputPath) {
    console.error(
      `Usage: node index.js <image-path> <output-dir> [git-origin-url]`
    )
  }

  if (process.env.DESTRUCTIVE) {
    shell.rm('-rf', outputPath)
  }
  if (fs.existsSync(outputPath)) {
    throw new Error(
      `Output path ${outputPath} already exists. Please delete it first.`
    )
  }

  let image
  try {
    image = await jimp.read(imagePath)
    image.grayscale()
  } catch (err) {
    throw new Error(`Could not read ${imagePath}: ${err}`)
  }
  if (image.getWidth() != WIDTH || image.getHeight() != HEIGHT) {
    throw new Error(`Input image dimensions must be exactly ${WIDTH}x${HEIGHT}`)
  }

  shell.mkdir('-p', outputPath)
  shell.cd(outputPath)
  shell.exec('git init')
  shell.ShellString('this repo exists to win the green squares').to('README')
  shell.exec('git add README')
  shell.exec('git commit -q -m "initial commit"')
  shell.exec('git config core.preloadindex true')

  if (repoUrl) {
    shell.exec(`git remote add origin "${repoUrl}"`)
  }

  const today = moment().tz('UTC')
  const start = moment(today).subtract(52, 'weeks').startOf('week')

  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      const value = (image.getPixelColor(x, y) >>> 24) / 255
      const numCommits = Math.floor(
        MIN_COMMITS * (1 - value) + MAX_COMMITS * value
      )
      const day = moment(start).add(x * 7 + y, 'days')
      if (day.isAfter(today)) {
        continue
      }
      for (let i = 0; i < numCommits; i++) {
        const date = moment(day).add(i, 'seconds').toISOString()
        const content = new Array(LINES_PER_COMMIT)
          .fill(0)
          .map(Math.random)
          .join('\n')
        fs.writeFileSync('data', content, 'utf8')
        shell.exec('git add data')
        shell.exec(`git commit -q -m "${date}" --date="${date}"`)
      }
      console.log(`${day.format('LL')}: ${numCommits} commits`)
    }
  }

  if (repoUrl && process.env.DESTRUCTIVE) {
    shell.exec('git push origin')
  }
}

main()
  .then(() => {
    console.log('Done.')
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
