import "@/styles/globals.css";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/navigation";
import { VisitProvider } from "@/contexts/VisitContext";
import Layout from "@/components/layout";
import { useBaseRoute } from "../hooks/useBaseRoute";
import localFont from "next/font/local";

const aspekta = localFont({
  src: "../../public/fonts/AspektaVF.woff2",
});

export default function App({ Component, pageProps }: AppProps) {
  const { isBaseRoute, currentBasePath } = useBaseRoute();

  return (
    <div className={`${aspekta.className}`}>
      <VisitProvider>
        <Navigation />
        <AnimatePresence mode="wait">
          <Layout key={currentBasePath}>
            <Component {...pageProps} />
          </Layout>
        </AnimatePresence>
      </VisitProvider>
    </div>
  );
}
