import "@/styles/globals.css";
import "../../public/fonts/font-face.css";
import localFont from "next/font/local";
import Navigation from "@/components/navigation";
import Layout from "@/components/layout";
import { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { VisitProvider } from "@/lib/contexts/visit";
import { DebugProvider } from "@/lib/contexts/debug";
import { usePathname } from "@/lib/hooks/use-pathname";

const aspekta = localFont({
  src: "../../public/fonts/AspektaVF.woff2",
});

export default function App({ Component, pageProps }: AppProps) {
  const { basePath } = usePathname();

  // console.log(`

  //                                       ####
  //                           ##          ####          ##
  //                         #####         ####         #####
  //                          #####        ####        ######
  //                           #####       ####       ######
  //                            #####      ####      #####
  //                             #####     ####     #####
  //                ####          #####    ####    #####          ####
  //               ########        #####   ####   #####        ########
  //                ##########      #####  ####  #####      ##########
  //                    #########    ################    #########
  //                       #########  ##############  #########
  //                          ##############################
  //                             ###########  ###########
  //                                ######      ######
  //            ########################          #########################
  //            #######################            ########################

  //                     Daybreak Studio — 2025 — daybreak.studio
  //                        A technology first design studio.

  //                          Are you a developer? Join us!
  //                            careers@daybreak.studio

  // `);

  return (
    <div className={`${aspekta.className}`}>
      <DebugProvider>
        <VisitProvider>
          <Navigation />
          <motion.div className="main-gradient fixed inset-0" />
          <AnimatePresence mode="wait">
            <Layout key={basePath}>
              <Component {...pageProps} />
            </Layout>
          </AnimatePresence>
        </VisitProvider>
      </DebugProvider>
    </div>
  );
}
