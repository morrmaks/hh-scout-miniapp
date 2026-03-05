import { VacancyFull } from "../types/types"
import { formatDescription } from "../utils/format"

export type JobDTO = {
  id: string
  title: string
  company: string
  url: string
  description: string
}

export function toJobDTO(job: VacancyFull): JobDTO {
  return {
    id: job.id,
    title: job.name,
    company: job.employer?.name ?? "Unknown",
    url: job.alternate_url,
    description: formatDescription(job.description)
  }
}