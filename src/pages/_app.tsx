import "@/styles/globals.css";
import "../../public/fonts/font-face.css";
import localFont from "next/font/local";
import Navigation from "@/components/navigation";
import Layout from "@/components/layout";
import { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { DebugProvider } from "@/lib/contexts/debug";
import { usePathname } from "@/lib/hooks/use-pathname";
import { useEffect } from "react";

const aspekta = localFont({
  src: "../../public/fonts/AspektaVF.woff2",
});

// Add an array of paths that have drawers
const DRAWER_PATHS = ["/"]; // Add other paths that use drawers

export default function App({ Component, pageProps }: AppProps) {
  const { basePath } = usePathname();

  // Check if current path has a drawer
  const hasDrawer = DRAWER_PATHS.includes(basePath);

  useEffect(() => {
    // Prevent overscroll/bounce effect
    document.body.style.overflow = "auto";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      document.documentElement.style.overscrollBehavior = "";
    };
  }, []);

  console.log(`

                                        ####
                            ##          ####          ##
                          #####         ####         #####
                           #####        ####        ######
                            #####       ####       ######
                             #####      ####      #####
                              #####     ####     #####
                 ####          #####    ####    #####          ####
                ########        #####   ####   #####        ########
                 ##########      #####  ####  #####      ##########
                     #########    ################    #########
                        #########  ##############  #########
                           ##############################
                              ###########  ###########
                                 ######      ######
             ########################          #########################
             #######################            ########################

                      Daybreak Studio — 2025 — daybreak.studio
                         A design and technology studio.

                           Are you a developer? Join us!
                             careers@daybreak.studio

  `);

  return (
    <div className={`${aspekta.className}`}>
      <DebugProvider>
        <Navigation disableScrollHiding={hasDrawer} />
        <motion.div className="main-gradient fixed inset-0 z-0" />
        <AnimatePresence mode="wait">
          <Layout key={basePath}>
            <Component {...pageProps} />
          </Layout>
        </AnimatePresence>
      </DebugProvider>
    </div>
  );
}
