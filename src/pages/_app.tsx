import "@/styles/globals.css";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/navigation";
import { VisitProvider } from "@/contexts/VisitContext";
import Layout from "@/components/layout";
import { useBaseRoute } from "../hooks/useBaseRoute";

export default function App({ Component, pageProps }: AppProps) {
  const { isBaseRoute, currentBasePath } = useBaseRoute();

  return (
    <VisitProvider>
      <Navigation />
      <AnimatePresence mode="wait">
        <Layout key={currentBasePath}>
          <Component {...pageProps} />
        </Layout>
      </AnimatePresence>
    </VisitProvider>
  );
}
