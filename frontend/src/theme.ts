import { extendTheme } from '@chakra-ui/react';

/**
 * This stylesheet is used to define the global styles for the application.
 * Inspired by (but not copied from) Horizon Ui Theme (https://horizon-ui.com/horizon-ui-chakra-ts).
 */
const customTheme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: 'hsl(225, 76%, 96%)', // rgb(244, 247, 254)
        color: 'hsl(210, 8%, 25%)',
      },
    }),
  },
  colors: {
    brand: {
      50: 'hsla(217, 92%, 96%, 1)',
      100: 'hsla(217, 89%, 85%, 1)',
      200: 'hsla(217, 83%, 74%, 1)',
      300: 'hsla(217, 76%, 63%, 1)',
      400: 'hsla(217, 69%, 53%, 1)',
      500: 'hsla(217, 100%, 44%, 1)', // primary
      600: 'hsla(217, 100%, 39%, 1)',
      700: 'hsla(217, 100%, 33%, 1)',
      800: 'hsla(217, 100%, 28%, 1)',
      900: 'hsla(217, 100%, 23%, 1)',
    },
    secondary: {
      50: 'hsla(186, 100%, 94%, 1)',
      100: 'hsla(186, 100%, 86%, 1)',
      200: 'hsla(186, 100%, 77%, 1)',
      300: 'hsla(186, 100%, 68%, 1)',
      400: 'hsla(186, 100%, 59%, 1)',
      500: 'hsla(186, 100%, 50%, 1)', // secondary
      600: 'hsla(186, 100%, 45%, 1)',
      700: 'hsla(186, 100%, 39%, 1)',
      800: 'hsla(186, 100%, 34%, 1)',
      900: 'hsla(186, 100%, 29%, 1)',
    },
    secondaryGray: {
      100: 'hsla(228, 43%, 94%, 1)',
      200: 'hsla(228, 44%, 95%, 1)',
      300: 'hsla(228, 100%, 98%, 1)',
      400: 'hsla(228, 56%, 96%, 1)',
      500: 'hsla(228, 15%, 73%, 1)',
      600: 'hsla(228, 20%, 83%, 1)',
      700: 'hsla(228, 38%, 56%, 1)',
      800: 'hsla(228, 38%, 56%, 1)',
      900: 'hsla(228, 64%, 20%, 1)',
    },
    gray: {
      50: 'hsla(210, 36%, 96%, 1)',
      100: 'hsla(210, 38%, 99%, 1)',
      200: 'hsla(210, 16%, 93%, 1)',
      300: 'hsla(210, 16%, 84%, 1)',
      400: 'hsla(210, 8%, 62%, 1)',
      500: 'hsla(210, 8%, 47%, 1)',
      600: 'hsla(210, 12%, 31%, 1)',
      700: 'hsla(210, 13%, 18%, 1)',
      800: 'hsla(210, 20%, 12%, 1)',
      900: 'hsla(210, 22%, 10%, 1)',
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Poppins, sans-serif',
  },
  fontSizes: {
    xl: '34px',
  },
});

export default customTheme;
