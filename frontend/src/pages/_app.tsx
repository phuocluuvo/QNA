"use client";
import {
  ChakraProvider,
  ColorModeProvider,
  ThemeProvider,
} from "@chakra-ui/react";
import theme from "../theme";
import Header from "@/components/Header";
import GoToTopButton from "@/components/GoToTopButton";
import { appWithI18Next } from "ni18n";
import store from "@/API/redux/store";
import { ni18nConfig } from "../../ni18n.config";
import "react-quill/dist/quill.snow.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { Provider } from "react-redux";
// @ts-ignore
function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
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
                <link
                  rel="stylesheet"
                  href="//cdn.quilljs.com/1.3.6/quill.bubble.css"
                ></link>
                <script src="//cdn.quilljs.com/1.3.6/quill.js"></script>
              </Head>
              <Header {...pageProps} />
              <GoToTopButton {...pageProps} />
              <Component data-i18n-is-dynamic-list={true} {...pageProps} />
            </ThemeProvider>
          </ColorModeProvider>
        </ChakraProvider>
      </Provider>
    </SessionProvider>
  );
}
export default appWithI18Next(App, ni18nConfig);
