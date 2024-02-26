import { objectsComparator, formatDateForSB } from "../utils/Utils.js"
import { getPlatformsFromIGDB } from "./WrapperIGDB.js"
import {
  GetPlatformsFromSupabase,
  CreatePlatformToSupabase,
  UpdatePlatformToSupabase,
  DeletePlatformToSupabase,
} from "./WrapperSupabase.js"

export async function ManagePlatforms(dryRun = false) {
  // Fetch data from IGDB
  const platformsFromIGDB = await getPlatformsFromIGDB()
  // console.log(platformsFromIGDB)

  // Fetch data from Supabase
  const platformsFromSupabase = await GetPlatformsFromSupabase()
  // console.log(platformsFromSupabase)

  if (!dryRun) {
    // Update / Create platform
    platformsFromIGDB.map((platform, index) => {
      const alreadyExists = platformsFromSupabase.some((platformCompared) => {
        return platformCompared.id === platform.id
      })
      if (alreadyExists) {
        const platformFromSupabase = platformsFromSupabase.find((c) => c.id === platform.id)
        // if (platform.id === 43219 || platform.id === 965) {
        // if (platform.id === 43219) { // Gamera Games
        // if (platform.id === 965) { // Ghost games
        const isIdentical = objectsComparator(platform, platformFromSupabase)
        if (!isIdentical) {
          console.log("Differences found on : ", platform.name, " | ", platform.id)
          UpdatePlatformToSupabase(Object.assign({ edited_at: formatDateForSB() }, { ...platform }))
        }
      } else {
        CreatePlatformToSupabase(platform)
      }
    })

    // Delete platform
    platformsFromSupabase.map((platform) => {
      const exists = platformsFromIGDB.some((platformCompared) => {
        return platformCompared.id === platform.id
      })
      if (!exists) {
        DeletePlatformToSupabase(platform)
      }
    })
  }
}
