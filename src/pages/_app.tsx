import "@/styles/globals.css";
import "../../public/fonts/font-face.css";
import { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
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
        <motion.div
          className="main-gradient fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <AnimatePresence mode="wait">
          <Layout key={currentBasePath}>
            <Component {...pageProps} />
          </Layout>
        </AnimatePresence>
      </VisitProvider>
    </div>
  );
}
