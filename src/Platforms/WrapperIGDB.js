import { baseUrl, baseAPI, log } from "../utils/Utils.js"
import IGDBClient from "../Common/IGDBClient.js"

const filters = []

async function getPlatformsList() {
  console.log(`\n\n\x1b[36mRequesting platforms from ${baseUrl}${baseAPI}/platforms\x1b[0m`)
  try {
    const response = await IGDBClient.fields(["checksum", "name", "platform_logo"]) // fetches only the name, movies, and age fields

      .limit(500) // limit to 50 results
      // .offset(2000) // offset results by 10

      // .sort("name") // default sort direction is 'asc' (ascending)
      // .sort("name", "desc") // sorts by name, descending
      // .search("mario") // search for a specific name (search implementations can vary)

      // .where(filters) // filter the results

      .request("/platforms") // execute the query and return a response object
    return response.data
  } catch (error) {
    console.log(error?.response?.data)
    throw new Error(`Failed to fetch platforms list`)
  }
}

export async function getPlatformsFromIGDB() {
  try {
    const platforms = await getPlatformsList()

    console.log(`\x1b[32m${platforms.length} platforms found\x1b[0m`)

    if (process.env.DRY_RUN) {
      log(platforms, "logs/platforms.json")
    }

    return platforms
  } catch (error) {
    console.error(error.message)
    return []
  }
}
