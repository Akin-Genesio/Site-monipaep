import { useQuery } from "react-query";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../services/apiClient";

type Patient = {
  id: string;
  name: string;
  CPF: string;
  email: string;
  gender: string;
  phone: string;
  neighborhood: string;
  birthdate: string;
  status: string;
  activeAccount: boolean;
  hasHealthPlan: boolean;
  createdAt: string;
}

type GetPatientsResponse = {
  patients: Patient[],
  totalPatients: number,
}

type FilterPatient = [
  filter: string,
  value: string
]

interface UsePatientsProps {
  page: number;
  filter?: FilterPatient
}

export async function getPatients(page: number, filter?: FilterPatient) {
  let params = { page }
  if(filter) {
    params = { ...params, [filter[0]]: filter[1] }
  }
  const { data } = await api.get<GetPatientsResponse>('/patients', { params })
  const formattedData = data.patients.map(patient => {
    const createdAtFormatted = format(parseISO(patient.createdAt), 'P', { locale: ptBR })
    const birthdateFormatted = format(parseISO(patient.birthdate), 'P', { locale: ptBR })
    const formattedCPF = 
      patient.CPF.slice(0, 3) + "." + patient.CPF.slice(3, 6) + "."
      + patient.CPF.slice(6, 9) + "-" + patient.CPF.slice(9, 12)
    return {
      ...patient,
      CPF: formattedCPF,
      createdAt: createdAtFormatted,
      birthdate: birthdateFormatted
    }
  })
  const patients: GetPatientsResponse = {
    patients: formattedData,
    totalPatients: data.totalPatients
  }
  return patients
}

export function usePatients({ page, filter = ['name', ''] }: UsePatientsProps) {
  const key = filter[1] === '' ? page : `${filter[0]}-${filter[1]}-${page}` 
  return useQuery(['patients', key], () => {
    if(!filter || filter[1] === '') {
      return getPatients(page)
    }
    return getPatients(page, filter)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}