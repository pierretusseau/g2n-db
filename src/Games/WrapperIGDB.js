import { baseUrl, baseAPI, log } from "../utils/Utils.js"
import IGDBClient from "../Common/IGDBClient.js"

// fields name,involved_companies,first_release_date,hypes,genres; limit 500; where first_release_date > 0 & hypes > 1 & involved_companies > 0;

async function getGamesList() {
  console.log(`Requesting games from ${baseUrl}${baseAPI}/games`)
  try {
    const response = await IGDBClient.fields(["checksum", "name", "involved_companies", "first_release_date", "hypes", "genres"]) // fetches only the name, movies, and age fields

      .limit(500) // limit to 50 results
      // .offset(2000) // offset results by 10

      // .sort("name") // default sort direction is 'asc' (ascending)
      // .sort("name", "desc") // sorts by name, descending
      // .search("mario") // search for a specific name (search implementations can vary)

      .where(`first_release_date > 0 & hypes > 10 & involved_companies > 0`) // filter the results

      .request("/games") // execute the query and return a response object
    return response.data
  } catch (error) {
    console.log(error?.response?.data)
    throw new Error(`Failed to fetch games list`)
  }
}

export async function getGamesFromIGDB() {
  try {
    const games = await getGamesList()

    console.log(`\n\x1b[32m${games.length} games found\x1b[0m`)

    if (process.env.DRY_RUN) {
      log(games, "logs/games.json")
    }

    return games
  } catch (error) {
    console.error(error.message)
    return []
  }
}
