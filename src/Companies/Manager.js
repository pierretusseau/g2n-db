import { getCompaniesFromIGDB } from "./WrapperIGDB.js"
import {
  GetCompaniesFromSupabase,
  CreateCompanyToSupabase,
  UpdateCompanyToSupabase,
  DeleteCompanyToSupabase,
} from "./WrapperSupabase.js"

export async function ManageCompanies(dryRun = false) {
  // Fetch data from Fandom
  const companiesFromIGDB = await getCompaniesFromIGDB()
  // console.log(companiesFromIGDB)

  // Fetch data from Supabase
  const companiesFromSupabase = await GetCompaniesFromSupabase()
  // console.log(companiesFromSupabase)

  if (!dryRun) {
    // Update / Create company
    companiesFromIGDB.map((company) => {
      const alreadyExists = companiesFromSupabase.some((companyCompared) => {
        return companyCompared.name === company.name
      })
      if (alreadyExists) {
        UpdateCompanyToSupabase(company)
      } else {
        CreateCompanyToSupabase(company)
      }
    })

    // Delete company
    companiesFromSupabase.map((company) => {
      const exists = companiesFromIGDB.some((companyCompared) => {
        return companyCompared.name === company.name
      })
      if (!exists) {
        DeleteCompanyToSupabase(company)
      }
    })
  }
}
