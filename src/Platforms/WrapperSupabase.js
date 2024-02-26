import supabaseClient from "../Common/SupabaseClient.js"

async function handleSupabaseError(response) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetPlatformsFromSupabase() {
  return supabaseClient.from("platforms").select().then(handleSupabaseError)
}

export async function CreatePlatformToSupabase(data) {
  return supabaseClient
    .from("platforms")
    .insert([data])
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function UpdatePlatformToSupabase(data) {
  return supabaseClient
    .from("platforms")
    .update(data)
    .match({ id: data.id })
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function DeletePlatformToSupabase(data) {
  return supabaseClient.from("platforms").delete().match({ id: data.id }).select().then(handleSupabaseError)
}
