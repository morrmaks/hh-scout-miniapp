import express from "express"
import cors from "cors"

import { router } from "./router/index.js"
import { errorMiddleware } from "./middleware/errorMiddleware"
import { searchSessions, vacancyCache } from "./cache/hhCache.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/", router);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("API running on http://localhost:3000")
})

setInterval(() => {
  vacancyCache.cleanup()
  searchSessions.cleanup()

  console.log(
    "Cache cleanup",
    "search:", searchSessions.size(),
    "vacancies:", vacancyCache.size()
  )
}, 24 * 60 * 60 * 1000)