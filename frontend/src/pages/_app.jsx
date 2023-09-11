import {
  ChakraProvider,
  ColorModeProvider,
  ThemeProvider,
} from "@chakra-ui/react";
import theme from "../theme";
import Header from "@/components/Header";
import GoToTopButton from "@/components/GoToTopButton";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "../../ni18n.config";
import Head from "next/head";
function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Question Dân It</title>
            <meta
              name="description"
              content="The website answers the question about IT"
            />
            <link rel="icon" href="/images/favicon.ico" sizes="any" />
          </Head>
          <Header />
          <GoToTopButton />
          <Component {...pageProps} />
        </ThemeProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
export default appWithI18Next(App, ni18nConfig);
