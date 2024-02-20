import supabaseClient from "../Common/SupabaseClient.js"

async function handleSupabaseError(response) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetGenresFromSupabase() {
  return supabaseClient.from("genres").select().then(handleSupabaseError)
}

export async function CreateGenreToSupabase(data) {
  return supabaseClient
    .from("genres")
    .insert([data])
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function UpdateGenreToSupabase(data) {
  return supabaseClient
    .from("genres")
    .update(data)
    .match({ checksum: data.checksum })
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function DeleteGenreToSupabase(data) {
  return supabaseClient
    .from("genres")
    .delete()
    .match({ checksum: data.checksum })
    .select()
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}
