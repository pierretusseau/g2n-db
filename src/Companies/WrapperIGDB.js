// import axios from "axios"
import { baseUrl, baseAPI, concatenateCompanies, drawLoadingBar, consoleLine, log } from "../utils/Utils.js"
import IGDBClient from "../Common/IGDBClient.js"
import { GetGamesFromSupabase } from "../Games/WrapperSupabase.js"

const estimatedNumberOfPages = 363

async function getInvolvedCompaniesList(companies, offset) {
  try {
    const response = await IGDBClient.fields(["checksum", "company", "developer", "publisher"])
      .limit(500)
      .offset(offset)
      .where(`id = (${companies.join(",")})`)
      .request("/involved_companies")
    // .request("/companies")

    return response.data
  } catch (error) {
    console.log(error?.response?.data)
    throw new Error(`Failed to fetch companies list`)
  }
}

async function getCompaniesList(gameIds, offset) {
  try {
    const response = await IGDBClient.fields(["checksum", "name", "websites", "developed", "published", "description", "country"])
      .limit(500)
      .offset(offset)
      .where(`developed = (${gameIds.join(",")})`)
      .where(`published = (${gameIds.join(",")})`)
      .request("/companies")

    return response.data
  } catch (error) {
    console.log(error?.response?.data)
    throw new Error(`Failed to fetch companies list`)
  }
}

async function getAllInvolvedCompanies() {
  const gamesFromSupabase = await GetGamesFromSupabase()
  const companiesIDs = concatenateCompanies(gamesFromSupabase)
  const numberofCompanies = companiesIDs.length
  console.log(
    `\nRequesting involved_companies from ${baseUrl}${baseAPI}/involved_companies with ${numberofCompanies} to look for`
  )
  let offset = 0
  let allCompanies = []

  while (true) {
    const companies = await getInvolvedCompaniesList(companiesIDs, offset)

    if (companies.length === 0) {
      consoleLine(
        `\x1b[32m${companies.length} companies found on page ${offset / 500}/${Math.ceil(
          numberofCompanies / 500
        )}\x1b[0m | ${drawLoadingBar(1)}`
      )
      console.log(`\n\x1b[32mNo more companies to find after page ${offset / 500}/${offset / 500}\x1b[0m`)
      console.log(`\x1b[32mFound\x1b[0m ${allCompanies.length}\x1b[32m total\x1b[0m`)
      break // No more companies to fetch
    }

    consoleLine(
      `\x1b[32m${companies.length} companies found on page ${offset / 500}/${Math.ceil(
        numberofCompanies / 500
      )}\x1b[0m | ${drawLoadingBar(offset / numberofCompanies)}`
    )
    // companies.map((c) => console.log(c.name));

    // companies.filter((c) => companies.includes(c.company))
    allCompanies = allCompanies.concat(companies)
    offset += 500
  }

  return allCompanies
}

async function getAllCompanies() {
  try {
    const gamesFromSupabase = await GetGamesFromSupabase()
    const companiesIDs = concatenateCompanies(gamesFromSupabase)
    const numberofCompanies = companiesIDs.length
    console.log(`\nRequesting companies from ${baseUrl}${baseAPI}/companies with ${numberofCompanies} to look for`)
    let offset = 0
    let allCompanies = []

    while (true) {
      const companies = await getCompaniesList(
        gamesFromSupabase.map((g) => g.id),
        offset
      )

      if (companies.length === 0) {
        consoleLine(`\x1b[32m${companies.length} companies found on page ${offset / 500}/?\x1b[0m | ${drawLoadingBar(1)}`)
        console.log(`\n\x1b[32mNo more companies to find after page ${offset / 500}/${offset / 500}\x1b[0m`)
        console.log(`\x1b[32mFound\x1b[0m ${allCompanies.length}\x1b[32m total\x1b[0m`)
        break // No more companies to fetch
      }

      consoleLine(`\x1b[32m${companies.length} companies found on page ${offset / 500}/?\x1b[0m`)
      // companies.map((c) => console.log(c.name));

      // const filteredCompanies = companies.filter((c) => c.developed.includes())
      allCompanies = allCompanies.concat(companies)
      offset += 500
    }

    return allCompanies
  } catch (error) {
    console.log(error?.response?.data)
    throw new Error(`Failed to fetch all companies list`)
  }
}

export async function getCompaniesFromIGDB() {
  try {
    // const allInvolvedCompanies = await getAllInvolvedCompanies()
    const allCompanies = await getAllCompanies()

    // console.log(allInvolvedCompanies)
    if (process.env.DRY_RUN) {
      // log(allInvolvedCompanies, "logs/allInvolvedCompanies.json")
      log(allCompanies, "logs/allCompanies.json")
    }
    // console.log(allCompanies)

    // return []
    return allCompanies
  } catch (error) {
    console.error(error.message)
    return []
  }
}