import { useQuery } from "react-query";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../services/apiClient";

type SymptomOccurrencesResponse = {
  id: string;
  patient_id: string;
  symptom_name: string;
  registered_date: string;
}

type SymptomOccurrences = {
  id: string;
  patient_id: string;
  symptom_name: string;
  registered_date: string;
  formatted_date: string;
}

interface UsePatientSymptomOccurrencesProps {
  patientId: string;
}

export async function getPatientSymptomOccurrences(patientId: string) {
  const { data } = await api.get<SymptomOccurrencesResponse[]>('/symptomoccurrence/', { 
    params: {
      patient_id: patientId,
      unassigned: 't',
    } 
  })
  const formattedData: SymptomOccurrences[] = data.map(occurrence => {
    const formattedDate = format(parseISO(occurrence.registered_date), 'Pp', { locale: ptBR })
    return {
      ...occurrence,
      formatted_date: formattedDate.replace(",", " às")
    }
  })

  return formattedData
}

export function usePatientSymptomOccurrences({ patientId }: UsePatientSymptomOccurrencesProps) {
  return useQuery(['patientSymptomOccurrences', patientId], () => {
    return getPatientSymptomOccurrences(patientId)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}