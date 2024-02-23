import { baseUrl, baseAPI, log } from "../utils/Utils.js"
import IGDBClient from "../Common/IGDBClient.js"

// main_game	0
// dlc_addon	1
// expansion	2
// bundle	3
// standalone_expansion	4
// mod	5
// episode	6
// season	7
// remake	8
// remaster	9
// expanded_game	10
// port	11
// fork	12
// pack	13
// update	14

const filters = ["first_release_date != 0", "rating >= 85", "rating_count >= 38", " category = (0,2,4,8,9,10)"]

async function getGamesList() {
  console.log(`\n\n\x1b[36mRequesting games from ${baseUrl}${baseAPI}/games\x1b[0m`)
  try {
    const response = await IGDBClient.fields([
      "checksum",
      "name",
      "first_release_date",
      "genres",
      "rating",
      "rating_count",
      "category",
    ]) // fetches only the name, movies, and age fields

      .limit(500) // limit to 50 results
      // .offset(2000) // offset results by 10

      // .sort("name") // default sort direction is 'asc' (ascending)
      // .sort("name", "desc") // sorts by name, descending
      // .search("mario") // search for a specific name (search implementations can vary)

      .where(filters) // filter the results

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

    console.log(`\x1b[32m${games.length} games found\x1b[0m`)

    if (process.env.DRY_RUN) {
      log(games, "logs/games.json")
    }

    return games
  } catch (error) {
    console.error(error.message)
    return []
  }
}
