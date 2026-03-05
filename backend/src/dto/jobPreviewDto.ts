import { VacancyShort } from "../types/types"

export type JobPreviewDTO = {
  id: string
  title: string
  company: string
  url: string
}

export function toJobPreviewDTO(job: VacancyShort): JobPreviewDTO {
  return {
    id: job.id,
    title: job.name,
    company: job.employer?.name ?? "Unknown",
    url: job.alternate_url
  }
}