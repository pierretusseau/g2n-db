import supabaseClient from "../Common/SupabaseClient.js"

async function handleSupabaseError(response) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetAppGamesFromSupabase() {
  return supabaseClient.from("app_games").select().then(handleSupabaseError)
}

export async function CreateAppGameToSupabase(data) {
  return supabaseClient
    .from("app_games")
    .insert([data])
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function UpdateAppGameToSupabase(data) {
  return supabaseClient
    .from("app_games")
    .update(data)
    .match({ id: data.id })
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function DeleteAppGameToSupabase(data) {
  return supabaseClient
    .from("app_games")
    .delete()
    .match({ id: data.id })
    .select()
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}
