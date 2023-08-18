import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    custom: {
      "blue-50": "#EDF1FD",
      "blue-100": "#DAE3FB",
      "blue-200": "#C8D5F9",
      "blue-300": "#C4D3F9",
      "blue-350": "#A3B9F5",
      "blue-400": "#91ABF3",
      "blue-500": "#6C8FEF",
      "blue-600": "#4773EB",
      "blue-700": "#184DDC",
      "blue-800": "#1440B8",
      "blue-900": "#0E2D81",
      "blue-light": "#103E93",
      "blue-dark": "#0B2559",
      "blue-logo": "#0597FF",
      "gray-light": "#647AA6",
      "gray-800": "#202124",
      "gray-700": "#232E3D",
    }
  },
  fonts: {
    heading: "'Roboto', 'Comfortaa'",
    body: "'Inter', 'Roboto'",
  },
  styles: {
    global: {
      body: {
        bg: 'blue-300',
      }
    }
  }
})