import supabaseClient from "../Common/SupabaseClient.js"

async function handleSupabaseError(response) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetCompaniesFromSupabase() {
  return supabaseClient.from("companies").select().then(handleSupabaseError)
}

export async function CreateCompanyToSupabase(data) {
  return supabaseClient
    .from("companies")
    .insert([data])
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function UpdateCompanyToSupabase(data) {
  return supabaseClient
    .from("companies")
    .update(data)
    .match({ id: data.id })
    .then(handleSupabaseError)
    .catch((err) => console.log(err))
}

export async function DeleteCompanyToSupabase(data) {
  return supabaseClient.from("companies").delete().match({ id: data.id }).select().then(handleSupabaseError)
}
