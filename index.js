const fs = require('fs')
const jimp = require('jimp')
const moment = require('moment-timezone')
const shell = require('shelljs')
const tmp = require('tmp')

const WIDTH = 53
const HEIGHT = 7
const MIN_COMMITS = 0
const MAX_COMMITS = 100
const LINES_PER_COMMIT = 100

tmp.setGracefulCleanup()
shell.set('-e')

const main = async () => {
  const [imagePath, outputPath, repoUrl] = process.argv.slice(2)
  if (!imagePath || !outputPath) {
    console.error(
      `Usage: node index.js <image-path> <output-dir> [git-origin-url]`
    )
    process.exit(1)
  }

  if (!process.env.DESTRUCTIVE && fs.existsSync(outputPath)) {
    throw new Error(
      `Output path ${outputPath} already exists. Please delete it first.`
    )
  } else {
    shell.rm('-rf', outputPath)
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

  const stream = fs.createWriteStream(tmp.tmpNameSync())
  console.log(`Writing git fast-import file to ${stream.path}`)

  const name = shell.exec('git config user.name').stdout.trim()
  const email = shell.exec('git config user.email').stdout.trim()

  const today = moment().tz('UTC')
  const start = moment(today).subtract(52, 'weeks').startOf('week')

  let mark = 1
  stream.write(`reset refs/heads/master\n\n`)

  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      const day = moment(start).add(x * 7 + y, 'days')
      if (day.isAfter(today)) {
        continue
      }

      const value = (image.getPixelColor(x, y) >>> 24) / 255
      const numCommits = Math.floor(
        MIN_COMMITS * (1 - value) + MAX_COMMITS * value
      )

      for (let i = 0; i < numCommits; i++) {
        const content = Buffer.from(
          new Array(LINES_PER_COMMIT).fill(0).map(Math.random).join('\n'),
          'utf8'
        )

        const blobMark = mark++
        const commitMark = mark++
        const now = day.unix() + i
        stream.write(`blob\n`)
        stream.write(`mark :${blobMark}\n`)
        stream.write(`data ${content.byteLength}\n`)
        stream.write(content)
        stream.write(`\n`)
        stream.write(`commit refs/heads/master\n`)
        stream.write(`mark :${commitMark}\n`)
        stream.write(`author ${name} <${email}> ${now} +0000\n`)
        stream.write(`committer ${name} <${email}> ${now} +0000\n`)
        stream.write(`data 4\nYOLO\n`)
        if (commitMark > 2) {
          stream.write(`from :${commitMark - 2}\n`)
        }
        stream.write(`M 100644 :${blobMark} data\n`)
        stream.write(`\n`)
      }
    }
  }

  await new Promise((resolve, reject) => stream.end(resolve))

  shell.mkdir('-p', outputPath)
  shell.cd(outputPath)
  shell.exec('git init')

  console.log('Importing...')
  shell.exec(`git fast-import --quiet <"${stream.path}"`)

  if (repoUrl) {
    shell.exec(`git remote add origin "${repoUrl}"`)
    if (process.env.DESTRUCTIVE) {
      console.log('Pushing...')
      shell.exec('git push -f origin')
    }
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
