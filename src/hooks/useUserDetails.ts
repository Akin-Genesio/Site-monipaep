import { useQuery } from "react-query";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../services/apiClient";

type SystemUser = {
  id: string;
  name: string;
  CPF: string;
  email: string;
  department: string;
  createdAt: string;
}

interface UseUserDetailsProps {
  userId: string | undefined;
}

export async function getUserDetails(userId: string) {
  const { data } = await api.get<SystemUser[]>('/systemuser', { params: { id: userId } })
  const formattedData = data.map(user => {
    const formattedDate = format(parseISO(user.createdAt), 'Pp', { locale: ptBR })
    const departmentName = user.department === "USM" ? "Unidade de saúde" : "Vigilância em saúde"
    const formattedCPF = 
      user.CPF.slice(0, 3) + "." + user.CPF.slice(3, 6) + "."
      + user.CPF.slice(6, 9) + "-" + user.CPF.slice(9, 12)
    return {
      ...user,
      createdAt: formattedDate,
      department: departmentName,
      CPF: formattedCPF,
    }
  })

  const userData: SystemUser = formattedData[0]

  return userData
}

export function useUserDetails({ userId }: UseUserDetailsProps) {
  return useQuery(['userDetails', userId], () => {
    if(userId) {
      return getUserDetails(userId)
    }
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 60
  })
}