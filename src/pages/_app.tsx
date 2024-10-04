import "@/styles/globals.css";
import { AppProps } from "next/app";
import Layout from "./_layout";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Component key={router.route} {...pageProps} />
      </AnimatePresence>
    </Layout>
  );
}
