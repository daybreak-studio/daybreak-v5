import "@/styles/globals.css";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/navigation";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <main>
      <Navigation />
      <AnimatePresence mode="wait">
        <Component key={router.route} {...pageProps} />
      </AnimatePresence>
    </main>
  );
}
