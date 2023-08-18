import { useQuery } from "react-query";

import { api } from "../services/apiClient";

type AssignedHealthProtocolResponse = {
  disease_name: string;
  healthprotocol: {
    id: string;
    title: string;
    description: string;
  };
}

type GetAssignedHealthProtocolsResponse = {
  assignedHealthProtocols: AssignedHealthProtocolResponse[],
  totalAssignedHealthProtocols: number,
}

type FilterAssignedHealthProtocol = [
  filter: string,
  value: string
]
interface UseAssignedHealthProtocolProps {
  page: number;
  filter?: FilterAssignedHealthProtocol;
}

export async function getAssignedHealthProtocols(page: number, filter?: FilterAssignedHealthProtocol) {
  let params: any = { page }

  if(filter) {
    params = { ...params, [filter[0]]: filter[1] }
  }
  
  const { data } = await api.get<GetAssignedHealthProtocolsResponse>('/assignedhealthprotocol', { params })
  const formattedData = data.assignedHealthProtocols.map(assignedHealthProtocol => {
    return {
      diseaseName: assignedHealthProtocol.disease_name,
      healthProtocol: assignedHealthProtocol.healthprotocol
    }
  })

  return {
    assignedHealthProtocols: formattedData,
    totalAssignedHealthProtocols: data.totalAssignedHealthProtocols,
  }
}

export function useAssignedHealthProtocols({ page, filter = ['disease_name', ''] }: UseAssignedHealthProtocolProps) { 
  const key = filter[1] === '' ? page : `${filter[0]}-${filter[1]}-${page}`
  return useQuery(['assignedHealthProtocols', key], () => {
    if(!filter || filter[1] === '') {
      return getAssignedHealthProtocols(page)
    }
    return getAssignedHealthProtocols(page, filter)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}