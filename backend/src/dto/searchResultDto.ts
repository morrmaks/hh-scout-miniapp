import { JobDTO } from "./jobDto"

export type SearchResultDTO = {
  items: JobDTO[]
  page: number
  pages: number
  found: number
}