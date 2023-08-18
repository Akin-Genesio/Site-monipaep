import { useQuery } from "react-query";

import { api } from "../services/apiClient";

type Faq = {
  id: string;
  question: string;
  answer: string;
}

type GetFaqsResponse = {
  faqs: Faq[],
  totalFaqs: number,
}

interface UseFaqsProps {
  filter?: string;
}

export async function getFaqs(filter?: string) {
  let params = {}
  if(filter !== '') {
    params = { question: filter }
  }
  const { data } = await api.get<GetFaqsResponse>('/faq', { params })
  return data
}

export function useFaqs({ filter = '' }: UseFaqsProps) { 
  return useQuery(['faqs', filter], () => {
    return getFaqs(filter)
  }, {
    keepPreviousData: true,
    staleTime: 1000 * 10
  })
}