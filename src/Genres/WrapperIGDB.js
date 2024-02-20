import { baseUrl, baseAPI, log } from "../utils/Utils.js"
import IGDBClient from "../Common/IGDBClient.js"

async function getGenresList() {
  console.log(`\n\n\x1b[36mRequesting genres from ${baseUrl}${baseAPI}/genres\x1b[0m`)
  try {
    const response = await IGDBClient.fields(["checksum", "name"]) // fetches only the name, movies, and age fields
      .limit(500) // limit to 500 results
      .request("/genres") // execute the query and return a response object

    return response.data
  } catch (error) {
    console.log(error)
    console.log(error?.response?.data)
    throw new Error(`Failed to fetch genres list`)
  }
}

export async function getGenresFromIGDB() {
  try {
    const genres = await getGenresList()

    console.log(`\x1b[32m${genres.length} genres found\x1b[0m`)

    if (process.env.DRY_RUN) {
      log(genres, "logs/genres.json")
    }

    return genres
  } catch (error) {
    console.error(error.message)
    return []
  }
}
