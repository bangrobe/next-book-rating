import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import AuthContextProvider from "@/context/authContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  );
}
