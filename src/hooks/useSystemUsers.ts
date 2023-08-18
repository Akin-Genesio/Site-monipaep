import { useQuery } from "react-query";
import { api } from "../services/apiClient";

type SystemUser = {
  systemUser: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  authorized: boolean;
  localAdm: boolean;
  generalAdm: boolean;
}

type GetSystemUsersResponse = {
  systemUsers: SystemUser[],
  totalSystemUsers: number,
}

interface UseSystemUserProps {
  page: number;
  filter?: string
}

export async function getSystemUsers(page: number, filter?: string) {
  let params: any = { page }

  if(filter) {
    params = { ...params, name: filter }
  }

  const { data } = await api.get<GetSystemUsersResponse>('/permissions', { params })
  return data
}

export function useSystemUsers({ page, filter = '' }: UseSystemUserProps) {
  return useQuery(['systemUsers', page, filter], () => {
    if(filter === '') {
      return getSystemUsers(page)
    }
    return getSystemUsers(page, filter)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}