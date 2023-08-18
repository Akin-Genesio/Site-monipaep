import { useQuery } from "react-query";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../services/apiClient";

type DiseaseOccurrenceResponse = {
  id: string;
  patient_id: string;
  disease_name: string;
  diagnosis: string;
  date_start: string;
  date_end: string | null;
  status: string;
}

interface DiseaseOccurrence extends DiseaseOccurrenceResponse {
  date_start_formatted: string;
  date_end_formatted: string | null;
}

type SymptomOccurrence = {
  id: string;
  patient_id: string;
  symptom_name: string;
  registered_date: string;
}

type PatientMovementHistory = {
  id: string;
  description: string;
  date: string;
}

type GetDiseaseOccurrencesResponse = {
  occurrenceDetails: DiseaseOccurrenceResponse,
  symptomsList: SymptomOccurrence[],
  movementHistory: PatientMovementHistory[]
}

type DiseaseOccurrenceDetails = {
  occurrenceDetails: DiseaseOccurrence,
  symptomsList: SymptomOccurrence[],
  movementHistory: PatientMovementHistory[]
}

interface UsePatientDiseaseOccurrenceProps {
  occurrenceId: string;
}

export async function getPatientDiseaseOccurrence(occurrenceId: string) {
  const { data } = await api.get<GetDiseaseOccurrencesResponse>(`/diseaseoccurrence/${occurrenceId}`)

  const dateStartFormatted = format(parseISO(data.occurrenceDetails.date_start), 'Pp', { locale: ptBR })
  let dateEndFormatted = data.occurrenceDetails.date_end

  if(dateEndFormatted) {
    dateEndFormatted = format(parseISO(dateEndFormatted), 'Pp', { locale: ptBR })
  }

  const formattedSymptomList = data.symptomsList.map(occurrence => {
    return {
      ...occurrence,
      registered_date: format(parseISO(occurrence.registered_date), 'Pp', { locale: ptBR })
    }
  })

  const formattedMovementHistory = data.movementHistory.map(movement => {
    return {
      ...movement,
      date: format(parseISO(movement.date), 'P', { locale: ptBR })
    }
  })
  
  const diseaseOccurrence: DiseaseOccurrenceDetails = {
    occurrenceDetails: { 
      ...data.occurrenceDetails,
      date_start_formatted: dateStartFormatted,
      date_end_formatted: dateEndFormatted
    },
    symptomsList: formattedSymptomList,
    movementHistory: formattedMovementHistory
  }

  return diseaseOccurrence
}

export function usePatientDiseaseOccurrence({ occurrenceId }: UsePatientDiseaseOccurrenceProps) {
  return useQuery(['patientDiseaseOccurrence', occurrenceId], () => {
    return getPatientDiseaseOccurrence(occurrenceId)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 5
  })
}