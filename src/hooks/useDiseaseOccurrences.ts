import { useQuery } from "react-query";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../services/apiClient";

type DiseaseOccurrences = {
  id: string;
  patient_id: string;
  disease_name: string;
  diagnosis: string;
  date_start: string;
  date_end: string | null;
  status: string;
  patient: {
    name: string;
    email: string;
  };
}

type GetDiseaseOccurrencesResponse = {
  diseaseOccurrences: DiseaseOccurrences[],
  totalDiseaseOccurrences: number,
}

type FilterDiseaseOccurrences = [
  filter: string,
  value: string
]

interface UseDiseaseOccurrencesProps {
  page: number;
  filter?: FilterDiseaseOccurrences
}

export async function getDiseaseOccurrences(page: number, filter?: FilterDiseaseOccurrences) {
  let params = { page }

  if(filter) {
    params = { ...params, [filter[0]]: filter[1] }
  }

  const { data } = await api.get<GetDiseaseOccurrencesResponse>('/diseaseoccurrence', { params })

  const formattedData = data.diseaseOccurrences.map(diseaseOccurrence => {
    const dateStartFormatted = format(parseISO(diseaseOccurrence.date_start), 'P', { locale: ptBR })
    let dateEndFormatted = diseaseOccurrence.date_end

    if(dateEndFormatted) {
      dateEndFormatted = format(parseISO(dateEndFormatted), 'P', { locale: ptBR })
    }

    return {
      ...diseaseOccurrence,
      date_start: dateStartFormatted,
      date_end: dateEndFormatted
    }
  })

  const diseaseOccurrences: GetDiseaseOccurrencesResponse = {
    diseaseOccurrences: formattedData,
    totalDiseaseOccurrences: data.totalDiseaseOccurrences
  }
  return diseaseOccurrences
}

export function useDiseaseOccurrences({ page, filter = ['patient_name', ''] }: UseDiseaseOccurrencesProps) {
  const key = filter[1] === '' ? page : `${filter[0]}-${filter[1]}-${page}` 
  return useQuery(['diseaseOccurrences', key], () => {
    if(!filter || filter[1] === '') {
      return getDiseaseOccurrences(page)
    }
    return getDiseaseOccurrences(page, filter)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}