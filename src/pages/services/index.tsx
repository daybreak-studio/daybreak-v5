import ServicesCarousel from "@/components/services-carousel";
import { WidgetGrid } from "@/components/widgets/grid";
import { WidgetDataProvider } from "@/components/widgets/grid/context";
import { Widget, WidgetRegistry } from "@/components/widgets/grid/types";
import { client } from "@/sanity/lib/client";
import { GetStaticProps } from "next";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import type { Services } from "@/sanity/types";
import MediaWidget from "@/components/widgets/variants/media";
import QuotesWidget from "@/components/widgets/variants/quotes";
import StagesWidget from "@/components/widgets/variants/stages";
import { EASINGS } from "@/components/animations/easings";
import { motion } from "framer-motion";
import { services } from "@/sanity/schemas/services";
import Link from "next/link";
import Footer from "@/components/footer";
import Lenis from "lenis";
import { useEffect } from "react";

const servicesWidgets: WidgetRegistry = {
  quotes: QuotesWidget,
  stages: StagesWidget,
  media: MediaWidget,
};

export default function Services({ servicesData }: { servicesData: Services }) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-center space-y-48 pt-48 lg:space-y-52">
      <section className="flex h-full w-full flex-col items-center justify-center space-y-2 lg:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.3,
            duration: 1,
            ease: EASINGS.easeOutQuart,
          }}
          className="w-8/12 max-w-[36ch] text-center text-2xl font-[450] text-neutral-700/25 md:text-3xl lg:text-3xl 2xl:text-4xl"
        >
          We shape ambitious brands & digital products at every stage of
          evolution
        </motion.h1>
        <div className="w-full overflow-hidden">
          <WidgetDataProvider
            data={{ widgets: servicesData.widgets as Widget[] }}
          >
            <WidgetGrid components={servicesWidgets} />
          </WidgetDataProvider>
        </div>
      </section>

      {servicesData.categories && (
        <ServicesCarousel categories={servicesData.categories} />
      )}

      <motion.section
        initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: 0.4,
          duration: 1,
          ease: EASINGS.easeOutQuart,
        }}
        className="flex flex-col items-center justify-center space-y-6 pb-24 text-center"
      >
        <motion.div className="flex w-8/12 flex-col items-center justify-center">
          <motion.h2
            transition={{
              delay: 0.3,
              duration: 1,
              ease: EASINGS.easeOutQuart,
            }}
            className="mb-4 w-fit text-lg text-neutral-700/40 md:text-lg lg:text-2xl"
          >
            Inquiries
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: EASINGS.easeOutQuart,
            }}
            className="w-fit text-2xl font-[450] text-neutral-700/40 md:text-3xl 2xl:w-2/3 2xl:text-4xl"
          >
            We&apos;re looking for people excited by the possibilities of
            technology, constantly exploring new means of expression and highly
            detailed in their practice.
          </motion.h1>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.3 } }}
          className="border-1 rounded-full border-neutral-500/50 bg-neutral-100/75 px-5 py-3 font-medium text-neutral-700/50 shadow-lg shadow-neutral-500/5"
        >
          <Link href="/contact">Get in Touch</Link>
        </motion.button>
      </motion.section>

      <Footer />
    </main>
  );
}

// Fetch data from Sanity CMS
export const getStaticProps: GetStaticProps = async () => {
  const servicesData = await client.fetch(SERVICES_QUERY);

  return {
    props: {
      servicesData,
    },
    revalidate: 60,
  };
};
