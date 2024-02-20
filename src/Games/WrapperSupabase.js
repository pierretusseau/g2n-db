import supabaseClient from "../Common/SupabaseClient.js"

async function handleSupabaseError(response) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetGamesFromSupabase() {
  return supabaseClient.from("games").select().then(handleSupabaseError)
}

export async function CreateGameToSupabase(data) {
  return supabaseClient
    .from("games")
    .insert([data])
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function UpdateGameToSupabase(data) {
  return supabaseClient
    .from("games")
    .update(data)
    .match({ checksum: data.checksum })
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function DeleteGameToSupabase(data) {
  return supabaseClient
    .from("games")
    .delete()
    .match({ checksum: data.checksum })
    .select()
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}
