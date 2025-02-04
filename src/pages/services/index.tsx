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

const servicesWidgets: WidgetRegistry = {
  quotes: QuotesWidget,
  stages: StagesWidget,
  media: MediaWidget,
};

export default function Services({ servicesData }: { servicesData: Services }) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center space-y-6 lg:space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: 0.3,
          duration: 1,
          ease: EASINGS.easeOutQuart,
        }}
        className="w-9/12 text-center text-2xl font-[450] text-neutral-700/25 md:w-5/12 md:text-3xl lg:text-3xl 2xl:text-4xl"
      >
        We shape ambitious brands & digital products at every stage of evolution
      </motion.h1>
      <WidgetDataProvider data={{ widgets: servicesData.widgets as Widget[] }}>
        <WidgetGrid components={servicesWidgets} />
      </WidgetDataProvider>
      {/* <ServicesCarousel /> */}
    </div>
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
