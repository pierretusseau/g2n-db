import fs from "fs"

export const baseUrl = "https://api.igdb.com"
export const baseAPI = "/v4"

export const errorHandler = (string, error = "") => {
  throw new Error(`\n🔥 \x1b[31m${string}\x1b[0m\n${error}`)
}

export const slugify = (name, separator = "-") => name.replace(/['\s]/g, separator).toLowerCase()

export const concatenateCompanies = (array) => {
  return array.reduce((accumulator, game) => {
    game?.involved_companies.forEach((company) => {
      if (!accumulator.includes(company)) {
        accumulator.push(company)
      }
    })
    return accumulator
  }, [])
}

export const drawLoadingBar = (progress) => {
  const barLength = 20
  const filledLength = Math.round(barLength * progress)
  const emptyLength = barLength - filledLength

  const progressBar = `[${"=".repeat(filledLength)}${" ".repeat(emptyLength)}] ~${Math.round(progress * 100)}%`

  return progressBar

  // if (progress === 1) {
  //   console.log("\n") // Move to the next line after completion
  // }
}

export const consoleLine = (text) => {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(text)
}

export const log = (results, filePath) => {
  const jsonData = JSON.stringify(results, null, 2)

  fs.writeFileSync(filePath, jsonData)
  console.log(`Results logged to: ${filePath}`)
}
