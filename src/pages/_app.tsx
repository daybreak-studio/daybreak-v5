import "@/styles/globals.css";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/navigation";
import { VisitProvider } from "@/contexts/VisitContext";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <VisitProvider>
      <main>
        <Navigation />
        <AnimatePresence mode="wait">
          <Component key={router.route} {...pageProps} />
        </AnimatePresence>
      </main>
    </VisitProvider>
  );
}
