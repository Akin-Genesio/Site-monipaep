import { useContext, useEffect } from "react"
import Link from 'next/link'
import Head from "next/head"
import { Link as ChakraLink } from "@chakra-ui/react"

import DashboardLayout from "../../components/Layouts/DashboardLayout"
import { AuthContext } from "../../contexts/AuthContext"
import { api } from "../../services/apiClient"
import { withSSRAuth } from "../../utils/withSSRAuth"
import { setupAPIClient } from "../../services/api"
import { Can } from "../../components/Can"

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Dashboard</title>
      </Head>
    </>
  )
}

Dashboard.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => {
  // const apiClient = setupAPIClient(ctx)
  // const response = await apiClient.get('/systemuser/me')

  // console.log(response.data)
  
  return {
    props: {}
  }
})
