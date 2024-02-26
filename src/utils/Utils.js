import fs from "fs"
import _ from "lodash"

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

export const formatDateForSB = (date) => {
  const currentDate = date || new Date()

  const isoString = currentDate.toISOString()

  // Extracting date and time components
  const datePart = isoString.slice(0, 10)
  const timePart = isoString.slice(11, 23)

  // Combining date and time with your desired format
  const formattedDate = `${datePart} ${timePart}+00`

  return formattedDate
}

export const excludeProperties = (obj, excludedProps) => {
  const result = { ...obj }
  excludedProps.forEach((prop) => delete result[prop])
  return result
}

export const compareArrays = (arr1, arr2, exclusions) => {
  const differences = arr1.reduce((result, item) => {
    if (!arr2.includes(item) && !exclusions.includes(item)) {
      result.push(item)
    }
    return result
  }, [])

  arr2.forEach((item) => {
    if (!arr1.includes(item) && !exclusions.includes(item)) {
      differences.push(item)
    }
  })

  return differences
}

export const checkObjectProperties = (obj, properties) => {
  return properties.every((property) => {
    if (obj.hasOwnProperty(property)) {
      const value = obj[property]

      // Check for null, empty string, or empty array depending on the property
      if (property === "published" || property === "developed" || property === "country") {
        return value === null
      } else if (property === "description") {
        return value === ""
      } else if (property === "websites") {
        // console.log("is array empty ?", Array.isArray(value) && value.length === 0)
        return Array.isArray(value) && value.length === 0
      }
    }

    // If the property is not present in the object, consider it as not meeting the criteria
    return false
  })
}

export const objectsComparator = (comparedObject, objectToCompare) => {
  const exclusions = ["created_at", "edited_at"]
  const comparedKeys = Object.keys(comparedObject)
  const toCompareKeys = Object.keys(objectToCompare)

  const isEqual = _.isEqual(comparedObject, excludeProperties(objectToCompare, exclusions))
  // console.log("isEqual", isEqual)
  if (!isEqual) {
    const comparison = compareArrays(comparedKeys, toCompareKeys, exclusions)
    // console.log("Differences in keys", comparison)
    const isEmptyProps = checkObjectProperties(objectToCompare, comparison)
    // console.log("isEmptyProps", isEmptyProps)
    return isEmptyProps ? _.isEqual(comparedObject, excludeProperties(objectToCompare, exclusions.concat(comparison))) : false
  }

  return true
}

export const removeDuplicates = (array) => {
  // Use a Set to keep track of unique combinations of "name" and "release_year"
  const seen = new Set()
  const duplicates = []

  // Use filter to create a new array with unique elements
  const filteredItems = array.filter((item) => {
    const date = new Date(item.first_release_date * 1000)
    const release_year = date.getFullYear()
    const key = item.name + release_year

    // If the combination of "name" and "release_year" is not in the Set, add it and return true
    if (!seen.has(key)) {
      seen.add(key)
      return true
    }

    // If the combination is in the Set, return false to exclude it from the filtered array
    duplicates.push({ id: item.id, game: `${item.name} (${release_year})` })
    return false
  })

  console.log("\x1b[34mGames with duplicates :\x1b[0m", `${duplicates.length}/${array.length}`, duplicates)

  return filteredItems
}
