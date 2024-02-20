import { GetGamesFromSupabase } from "../Games/WrapperSupabase.js"
import { GetAppGamesFromSupabase } from "../AppGames/WrapperSupabase.js"

const getMissingObjects = async () => {
  const games = await GetGamesFromSupabase()
  const appgames = await GetAppGamesFromSupabase()
  const missingObjects = games.filter((g) => !appgames.some((ag) => ag.id === g.id))
  console.log(`Found ${appgames.length}/${games.length} games`)
  console.log("Missing objects:", missingObjects)
}

getMissingObjects()
