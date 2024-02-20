import { ManageGames } from "./Games/Manager.js"
// import { ManageGenres } from "./Genres/Manager.js"
import { ManageCompanies } from "./Companies/Manager.js"

import { errorHandler } from "./utils/Utils.js"

const dryRun = process.env.DRY_RUN ?? false
const manager = process.env.MANAGER ?? ""

async function runManagerAsync(managerFn, name) {
  try {
    await managerFn(dryRun)
    if (!dryRun) console.log(`----- Finished ${name} job -----`)
  } catch (err) {
    errorHandler(`Failed ${name} job`, err.message || err)
  }
}

if (manager === "games") {
  runManagerAsync(ManageGames, "games")
  // } else if (manager === "genres") {
  //   runManagerAsync(ManageGenres, "genres")
} else if (manager === "companies") {
  runManagerAsync(ManageCompanies, "companies")
} else {
  const managers = [
    { fn: ManageGames, name: "games" },
    // { fn: ManageGenres, name: "genres" },
    { fn: ManageCompanies, name: "companies" },
  ]

  for (const { fn, name } of managers) {
    await runManagerAsync(fn, name)
  }
}
