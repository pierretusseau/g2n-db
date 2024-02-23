import { objectsComparator, formatDateForSB } from "../utils/Utils.js"
import { getGenresFromIGDB } from "./WrapperIGDB.js"
import { GetGenresFromSupabase, CreateGenreToSupabase, UpdateGenreToSupabase, DeleteGenreToSupabase } from "./WrapperSupabase.js"

export async function ManageGenres(dryRun = false) {
  // Fetch data from IGDB
  /*----------------------------------------------------*/
  const genresFromIGDB = await getGenresFromIGDB()
  // console.log("genresFromIGDB", genresFromIGDB)

  // Fetch data from Supabase
  /*----------------------------------------------------*/
  const genresFromSupabase = await GetGenresFromSupabase()
  // console.log(genresFromSupabase)

  if (!dryRun) {
    // Update / Create
    /*----------------------------------------------------*/
    genresFromIGDB.map((genre) => {
      const alreadyExists = genresFromSupabase.some((genreCompared) => {
        return genreCompared.id === genre.id
      })
      if (alreadyExists) {
        const isIdentical = objectsComparator(
          genre,
          genresFromSupabase.find((g) => g.id === genre.id)
        )
        if (!isIdentical) {
          UpdateGenreToSupabase({ ...genre, edited_at: formatDateForSB() })
        }
        // UpdateGenreToSupabase(genre)
      } else {
        CreateGenreToSupabase(genre)
      }
    })

    // Delete
    /*----------------------------------------------------*/
    genresFromSupabase.map((genre) => {
      const exists = genresFromIGDB.some((genreCompared) => {
        return genreCompared.id === genre.id
      })
      if (!exists) {
        DeleteGenreToSupabase(genre)
      }
    })
  }
}
