import { getGamesFromIGDB } from "./WrapperIGDB.js"
import { GetGamesFromSupabase, CreateGameToSupabase, UpdateGameToSupabase, DeleteGameToSupabase } from "./WrapperSupabase.js"

export async function ManageGames(dryRun = false) {
  // Fetch data from Fantom
  /*----------------------------------------------------*/
  const gamesFromIGDB = await getGamesFromIGDB()
  // console.log("gamesFromIGDB", gamesFromIGDB[0]["traits"])

  // Fetch data from Supabase
  /*----------------------------------------------------*/
  const gamesFromSupabase = await GetGamesFromSupabase()
  // console.log(gamesFromSupabase)

  if (!dryRun) {
    // Update / Create
    /*----------------------------------------------------*/
    gamesFromIGDB.map((game) => {
      const alreadyExists = gamesFromSupabase.some((gameCompared) => {
        return gameCompared.name === game.name
      })
      if (alreadyExists) {
        UpdateGameToSupabase(game)
      } else {
        CreateGameToSupabase(game)
      }
    })

    // Delete
    /*----------------------------------------------------*/
    gamesFromSupabase.map((game) => {
      const exists = gamesFromIGDB.some((gameCompared) => {
        return gameCompared.name === game.name
      })
      if (!exists) {
        DeleteGameToSupabase(game)
      }
    })
  }
}
