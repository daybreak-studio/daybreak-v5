import "@/styles/globals.css";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/navigation";
import { VisitProvider } from "@/contexts/VisitContext";
import Layout from "@/components/layout";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <VisitProvider>
      <Navigation />
      <AnimatePresence mode="wait">
        {/* <Layout key={router.route}> */}
        <Component {...pageProps} />
        {/* </Layout> */}
      </AnimatePresence>
    </VisitProvider>
  );
}
