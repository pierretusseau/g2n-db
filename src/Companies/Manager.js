import { objectsComparator, formatDateForSB } from "../utils/Utils.js"
import { getCompaniesFromIGDB } from "./WrapperIGDB.js"
import {
  GetCompaniesFromSupabase,
  CreateCompanyToSupabase,
  UpdateCompanyToSupabase,
  DeleteCompanyToSupabase,
} from "./WrapperSupabase.js"

export async function ManageCompanies(dryRun = false) {
  // Fetch data from IGDB
  const companiesFromIGDB = await getCompaniesFromIGDB()
  // console.log(companiesFromIGDB)

  // Fetch data from Supabase
  const companiesFromSupabase = await GetCompaniesFromSupabase()
  // console.log(companiesFromSupabase)

  if (!dryRun) {
    // Update / Create company
    companiesFromIGDB.map((company, index) => {
      const alreadyExists = companiesFromSupabase.some((companyCompared) => {
        return companyCompared.id === company.id
      })
      if (alreadyExists) {
        const companyFromSupabase = companiesFromSupabase.find((c) => c.id === company.id)
        // if (company.id === 43219 || company.id === 965) {
        // if (company.id === 43219) { // Gamera Games
        // if (company.id === 965) { // Ghost games
        const isIdentical = objectsComparator(company, companyFromSupabase)
        if (!isIdentical) {
          console.log("Differences found on : ", company.name, " | ", company.id)
          UpdateCompanyToSupabase(
            Object.assign(
              { published: [], developed: [], description: "", websites: [], edited_at: formatDateForSB() },
              { ...company }
            )
          )
        }
      } else {
        CreateCompanyToSupabase(company)
      }
    })

    // Delete company
    companiesFromSupabase.map((company) => {
      const exists = companiesFromIGDB.some((companyCompared) => {
        return companyCompared.id === company.id
      })
      if (!exists) {
        DeleteCompanyToSupabase(company)
      }
    })
  }
}
