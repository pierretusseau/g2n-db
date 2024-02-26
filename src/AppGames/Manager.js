import { objectsComparator, formatDateForSB, consoleLine, removeDuplicates } from "../utils/Utils.js"
import { GetGamesFromSupabase } from "../Games/WrapperSupabase.js"
import { GetGenresFromSupabase } from "../Genres/WrapperSupabase.js"
import { GetCompaniesFromSupabase } from "../Companies/WrapperSupabase.js"
import {
  GetAppGamesFromSupabase,
  CreateAppGameToSupabase,
  UpdateAppGameToSupabase,
  DeleteAppGameToSupabase,
} from "./WrapperSupabase.js"

const getCuratedListOfGames = async (gamesFromSupabase) => {
  try {
    console.log(`\n\n\x1b[36mBuilding curated list of games\x1b[0m`)
    // Fetch data from Supabase
    /*----------------------------------------------------*/
    const genresFromSupabase = await GetGenresFromSupabase()
    const companiesFromSupabase = await GetCompaniesFromSupabase()
    const gamesWithoutDeveloper = []
    const gamesWithoutPublisher = []
    const gamesWithoutDeveloperOrPublisher = []

    const curatedGamesList = removeDuplicates(gamesFromSupabase).map((game, index, array) => {
      // Year
      const date = new Date(game.first_release_date * 1000)
      const release_year = date.getFullYear()

      // Genres
      const genres = game.genres.map((ggenre) => {
        return genresFromSupabase.find((genre) => genre.id === ggenre).name
      })

      // Developer
      const developer = companiesFromSupabase
        .filter((company) => company.developed)
        .find((company) => {
          return company.developed.some((c) => c === game.id)
        })
      if (!developer) {
        gamesWithoutDeveloper.push({ id: game.id, name: game.name })
      }

      // Publisher
      const publisher = companiesFromSupabase
        .filter((company) => company.published)
        .find((company) => {
          return company.published.some((c) => c === game.id)
        })
      if (!publisher) {
        gamesWithoutPublisher.push({ id: game.id, name: game.name })
      }

      if (!publisher && !developer) {
        gamesWithoutDeveloperOrPublisher.push({ id: game.id, name: game.name })
      }

      if (!game.platforms) {
        console.log("Doesn' have platform :", game.name)
      }

      return {
        id: game.id,
        checksum: game.checksum,
        name: game.name,
        release_year: release_year,
        genres: genres,
        developer: developer?.id || publisher?.id,
        unsure_developer: !developer,
        publisher: publisher?.id || developer?.id,
        unsure_publisher: !publisher,
        rating: game.rating,
        rating_count: game.rating_count,
        category: game.category,
        platforms: game.platforms,
      }
    })

    console.log(
      "\x1b[34mGames without developer :\x1b[0m",
      `${gamesWithoutDeveloper.length}/${gamesFromSupabase.length}`,
      gamesWithoutDeveloper
    )
    console.log(
      "\x1b[34mGames without publisher :\x1b[0m",
      `${gamesWithoutPublisher.length}/${gamesFromSupabase.length}`,
      gamesWithoutPublisher
    )
    console.log(
      "\x1b[34mGames without developer and publisher :\x1b[0m",
      gamesWithoutDeveloperOrPublisher.length ? `${gamesWithoutDeveloperOrPublisher.length}/${gamesFromSupabase.length}` : "",
      gamesWithoutDeveloperOrPublisher.length ? gamesWithoutDeveloperOrPublisher : "None"
    )

    console.log(`\n${curatedGamesList.length} \x1b[32mgames curated\x1b[0m`)

    return curatedGamesList
  } catch (error) {
    console.log("Error while curating games list")
    throw new Error(error)
  }
}

export async function ManageAppGames(dryRun = false) {
  try {
    // Fetch data from Supabase
    /*----------------------------------------------------*/
    const gamesFromSupabase = await GetGamesFromSupabase()
    const appGamesFromSupabase = await GetAppGamesFromSupabase()
    const curatedGamesList = await getCuratedListOfGames(gamesFromSupabase, appGamesFromSupabase)

    if (!dryRun) {
      // Update / Create
      /*----------------------------------------------------*/
      console.error("\n----- 🐞 Bug on creation -----")
      console.error("should have", curatedGamesList.length, "of total games ?")
      curatedGamesList.map((game) => {
        const alreadyExists = appGamesFromSupabase.some((gameCompared) => {
          return gameCompared.id === game.id
        })
        if (alreadyExists) {
          const isIdentical = objectsComparator(
            game,
            appGamesFromSupabase.find((g) => g.id === game.id)
          )
          if (!isIdentical) UpdateAppGameToSupabase({ ...game, edited_at: formatDateForSB() })
        } else {
          CreateAppGameToSupabase(game)
        }
      })

      // Delete
      /*----------------------------------------------------*/
      curatedGamesList.map((game) => {
        const exists = appGamesFromSupabase.some((gameCompared) => {
          return gameCompared.id === game.id
        })
        if (!exists) {
          DeleteAppGameToSupabase(game)
        }
      })

      console.log(`\n${curatedGamesList.length}/${gamesFromSupabase.length} \x1b[32mgames found\x1b[0m`)
    }
  } catch (error) {
    throw new Error(error)
  }
}
