import { useQuery } from "react-query";

import { api } from "../services/apiClient";

type Disease = {
  name: string;
  infected_Monitoring_Days: number;
  suspect_Monitoring_Days: number;
}

type GetDiseasesResponse = {
  diseases: Disease[],
  totalDiseases: number,
}

interface UseDiseasesProps {
  page: number;
  filter?: string;
}

export async function getDiseases(page: number, filter?: string) {
  let params: any = { page }
  if(filter) {
    params = { ...params, name: filter }
  }
  const { data } = await api.get<GetDiseasesResponse>('/disease', { params })
  return data
}

export function useDiseases({ page, filter = '' }: UseDiseasesProps) { 
  return useQuery(['diseases', page, filter], () => {
    if(filter !== '') {
      return getDiseases(page, filter)
    }
    return getDiseases(page)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}