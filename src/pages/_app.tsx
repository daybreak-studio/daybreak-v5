import "@/styles/globals.css";
import "../../public/fonts/font-face.css";
import localFont from "next/font/local";
import Navigation from "@/components/navigation";
import Layout from "@/components/layout";
import { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { VisitProvider } from "@/contexts/VisitContext";
import { useBaseRoute } from "../hooks/useBaseRoute";
import { DebugProvider } from "@/contexts/DebugContext";

const aspekta = localFont({
  src: "../../public/fonts/AspektaVF.woff2",
});

export default function App({ Component, pageProps }: AppProps) {
  const { currentBasePath } = useBaseRoute();

  return (
    <div className={`${aspekta.className}`}>
      <DebugProvider>
        <VisitProvider>
          <Navigation />
          <motion.div className="main-gradient fixed inset-0" />
          <AnimatePresence mode="wait">
            <Layout key={currentBasePath}>
              <Component {...pageProps} />
            </Layout>
          </AnimatePresence>
        </VisitProvider>
      </DebugProvider>
    </div>
  );
}
