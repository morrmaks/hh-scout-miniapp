import { JobDTO } from "../dto/jobDto"

export type VacancyShort = {
  id: string
  name: string
  alternate_url: string
  employer?: {
    name: string
  }
}

export type VacancyFull = {
  id: string
  name: string
  alternate_url: string
  description: string
  employer?: {
    name: string
  }
}

export type SearchSession = {
  pages: JobDTO[][]
  pagesTotal: number
  found: number
}