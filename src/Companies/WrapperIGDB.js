// import axios from "axios"
import { baseUrl, baseAPI, concatenateCompanies, drawLoadingBar, consoleLine, log } from "../utils/Utils.js"
import IGDBClient from "../Common/IGDBClient.js"
import { GetGamesFromSupabase } from "../Games/WrapperSupabase.js"

async function getCompaniesList(gameIds, offset) {
  try {
    const response = await IGDBClient.fields(["checksum", "name", "websites", "developed", "published", "description", "country"])
      .limit(500)
      .offset(offset)
      .where(`developed = (${gameIds.join(",")}) | published = (${gameIds.join(",")})`)
      .request("/companies")

    return response.data
  } catch (error) {
    console.log(error?.response?.data)
    throw new Error(`Failed to fetch companies list`)
  }
}

async function getAllCompanies() {
  try {
    const gamesFromSupabase = await GetGamesFromSupabase()
    console.log(`\n\n\x1b[36mRequesting companies from ${baseUrl}${baseAPI}/companies\x1b[0m`)
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
