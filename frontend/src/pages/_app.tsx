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
import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import { Colors } from "@/assets/constant/Colors";
import "./index.css";
import { CacheProvider } from "@chakra-ui/next-js";
import PageContainer from "@/components/PageContainer";
import LayoutProvider from "@/provider/LayoutProvider";
import { ToastContainer } from "react-toastify";
// @ts-ignore
function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <CacheProvider>
          <ChakraProvider>
            <ColorModeProvider>
              {/* @ts-ignore */}
              <ThemeProvider theme={theme}>
                <LayoutProvider>
                  <Head>
                    <title>Question Dân It</title>
                    <meta
                      name="description"
                      content="The website answers the question about IT"
                    />
                    <meta
                      http-equiv="Content-Security-Policy"
                      content="upgrade-insecure-requests"
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
                  <NextNProgress
                    key={Math.random()}
                    color={Colors(false).PRIMARY}
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                    showOnShallow={true}
                  />
                  <PageContainer>
                    <Component
                      data-i18n-is-dynamic-list={true}
                      {...pageProps}
                    />
                    <ToastContainer />
                  </PageContainer>
                </LayoutProvider>
              </ThemeProvider>
            </ColorModeProvider>
          </ChakraProvider>
        </CacheProvider>
      </Provider>
    </SessionProvider>
  );
}
export default appWithI18Next(App, ni18nConfig);
