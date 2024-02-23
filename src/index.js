import { ManageGames } from "./Games/Manager.js"
import { ManageGenres } from "./Genres/Manager.js"
import { ManageCompanies } from "./Companies/Manager.js"
import { ManageAppGames } from "./AppGames/Manager.js"

import { errorHandler } from "./utils/Utils.js"

const dryRun = process.env.DRY_RUN ?? false
const manager = process.env.MANAGER ?? ""

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  // Handle the error, log it, or perform any necessary cleanup
})

async function runManagerAsync(managerFn, name) {
  try {
    await managerFn(dryRun)
    if (!dryRun) console.log(`\x1b[36m--------------------\x1b[0m Finished ${name} job \x1b[36m--------------------\x1b[0m`)
  } catch (err) {
    errorHandler(`Failed ${name} job`, err.message || err)
  }
}

if (manager === "games") {
  runManagerAsync(ManageGames, "games")
} else if (manager === "genres") {
  runManagerAsync(ManageGenres, "genres")
} else if (manager === "companies") {
  runManagerAsync(ManageCompanies, "companies")
} else if (manager === "app_games") {
  runManagerAsync(ManageAppGames, "app_games")
} else {
  const managers = [
    { fn: ManageGames, name: "games" },
    { fn: ManageGenres, name: "genres" },
    { fn: ManageCompanies, name: "companies" },
    { fn: ManageAppGames, name: "app_games" },
  ]

  for (const { fn, name } of managers) {
    await runManagerAsync(fn, name)
  }
}
