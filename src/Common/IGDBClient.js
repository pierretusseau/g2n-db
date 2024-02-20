import dotenv from "dotenv"
dotenv.config()
import igdb from "igdb-api-node"

export default igdb.default(process.env.CLIENT_ID, process.env.APP_TOKEN)
