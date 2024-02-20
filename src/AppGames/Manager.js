import { GetGamesFromSupabase } from "../Games/WrapperSupabase.js"
import { GetGenresFromSupabase } from "../Genres/WrapperSupabase.js"
import { GetCompaniesFromSupabase } from "../Companies/WrapperSupabase.js"
import {
  GetAppGamesFromSupabase,
  CreateAppGameToSupabase,
  UpdateAppGameToSupabase,
  DeleteAppGameToSupabase,
} from "./WrapperSupabase.js"

export async function ManageAppGames(dryRun = false) {
  console.log(`\n\n\x1b[36mBuilding AppGames\x1b[0m`)
  // Fetch data from Supabase
  /*----------------------------------------------------*/
  const gamesFromSupabase = await GetGamesFromSupabase()
  const genresFromSupabase = await GetGenresFromSupabase()
  const companiesFromSupabase = await GetCompaniesFromSupabase()
  const appGamesFromSupabase = await GetAppGamesFromSupabase()
  const gamesWithoutDeveloper = []
  const gamesWithoutPublisher = []
  const gamesWithoutDeveloperOrPublisher = []

  const curatedGamesList = gamesFromSupabase.map((game) => {
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

    return {
      id: game.id,
      checksum: game.checksum,
      name: game.name,
      release_year: release_year,
      genres: genres,
      developer: developer?.checksum || publisher?.checksum,
      unsure_developer: !developer,
      publisher: publisher?.checksum || developer?.checksum,
      unsure_publisher: !publisher,
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
    gamesWithoutDeveloperOrPublisher.length ? `${gamesWithoutPublisher.length}/${gamesFromSupabase.length}` : "",
    gamesWithoutDeveloperOrPublisher.length ? gamesWithoutDeveloperOrPublisher : "None"
  )

  // console.log(`\n${curatedGamesList.length}/${gamesFromSupabase.length} \x1b[32mgames found\x1b[0m`)

  if (!dryRun) {
    let gameCounter = 0
    // Update / Create
    /*----------------------------------------------------*/
    curatedGamesList.map((game) => {
      const alreadyExists = appGamesFromSupabase.some((gameCompared) => {
        return gameCompared.checksum === game.checksum
      })
      if (alreadyExists) {
        UpdateAppGameToSupabase(game)
      } else {
        CreateAppGameToSupabase(game)
      }
      gameCounter++
    })

    // Delete
    /*----------------------------------------------------*/
    curatedGamesList.map((game) => {
      const exists = appGamesFromSupabase.some((gameCompared) => {
        return gameCompared.checksum === game.checksum
      })
      if (!exists) {
        DeleteAppGameToSupabase(game)
      }
    })

    console.log(`\n${gameCounter}/${gamesFromSupabase.length} \x1b[32mgames found\x1b[0m`)
  }
}
