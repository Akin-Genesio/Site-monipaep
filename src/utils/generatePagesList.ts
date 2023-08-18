interface GeneratePagesListProps {
  totalRegisters: number;
  registersPerPage: number;
  currentPage: number;
  siblings?: number;
}

export function GeneratePagesList({ 
  totalRegisters, 
  registersPerPage, 
  currentPage, 
  siblings = 1 
}: GeneratePagesListProps) {
  const lastPage = Math.ceil(totalRegisters / registersPerPage)
  let initialArray = [1, lastPage]

  if(currentPage - siblings >= 1 || currentPage - siblings < 1) {
    for(let i = 0; i <= siblings; i++) {
      if(currentPage - i > 1) {
        initialArray.push(currentPage - i)
      }
    }
  } 
  
  if (currentPage + siblings <= lastPage || currentPage + siblings > lastPage) {
    for(let i = 0; i <= siblings; i++) {
      if(currentPage + i < lastPage) {
        initialArray.push(currentPage + i)
      }
    }
  }
  let pages = Array.from(new Set(initialArray)).sort((a, b) => a - b)

  if(currentPage - siblings > 2) {
    const firstPart = pages.slice(0,1)
    firstPart.push(-1)
    const fullArray = firstPart.concat(pages.slice(1))
    pages = fullArray
  }

  if(currentPage + siblings < lastPage - 1){
    const lastElement = pages.length
    const fullArray = pages.slice(0, lastElement - 1)
    fullArray.push(-1, lastPage)
    pages = fullArray
  }

  return pages
}