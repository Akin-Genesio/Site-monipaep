import { useQuery } from "react-query";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../services/apiClient";

type SymptomOccurrence = {
  id: string;
  patient_id: string;
  registered_date: string;
  patient: {
    name: string;
    email: string;
  };
}

type GetSymptomOccurrencesResponse = {
  symptomOccurrences: SymptomOccurrence[],
  totalSymptomOccurrences: number,
}

interface UseSymptomOccurrencesProps {
  page: number;
  filter?: string;
}

export async function getSymptomOccurrences(page: number, filter?: string) {
  let params: any = { page }
  if(filter) {
    params = { ...params, patient_name: filter }
  }
  const { data } = await api.get<GetSymptomOccurrencesResponse>('/symptomoccurrence/unassigned', { params })
  const formattedData = data.symptomOccurrences.map(occurrence => {
    const formattedDate = format(parseISO(occurrence.registered_date), 'Pp', { locale: ptBR })
    return {
      ...occurrence,
      registered_date: formattedDate.replace(",", " às")
    }
  })

  const formattedResponse: GetSymptomOccurrencesResponse = {
    symptomOccurrences: formattedData,
    totalSymptomOccurrences: data.totalSymptomOccurrences
  }

  return formattedResponse
}

export function useSymptomOccurrences({ page, filter = '' }: UseSymptomOccurrencesProps) { 
  return useQuery(['symptomOccurrences', page, filter], () => {
    if(filter !== '') {
      return getSymptomOccurrences(page, filter)
    }
    return getSymptomOccurrences(page)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}