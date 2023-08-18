import { useQuery } from "react-query";

import { api } from "../services/apiClient";

type HealthProtocol = {
  id: string;
  title: string;
  description: string;
}

type GetHealthProtocolsResponse = {
  healthProtocols: HealthProtocol[],
  totalHealthProtocols: number,
}

type FilterHealthProtocol = [
  filter: string,
  value: string
]
interface UseHealthProtocolProps {
  page: number;
  filter?: FilterHealthProtocol;
}

export async function getHealthProtocols(page: number, filter?: FilterHealthProtocol) {
  let params: any = { page }
  if(filter) {
    params = { ...params, [filter[0]]: filter[1] }
  }
  const { data } = await api.get<GetHealthProtocolsResponse>('/healthprotocol', { params })
  return data
}

export function useHealthProtocols({ page, filter = ['title', ''] }: UseHealthProtocolProps) { 
  const key = filter[1] === '' ? page : `${filter[0]}-${filter[1]}-${page}` 
  return useQuery(['healthProtocols', key], () => {
    if(!filter || filter[1] === '') {
      return getHealthProtocols(page)
    }
    return getHealthProtocols(page, filter)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}