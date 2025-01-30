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

const servicesWidgets: WidgetRegistry = {
  quotes: QuotesWidget,
  stages: StagesWidget,
  media: MediaWidget,
};

export default function Services({ servicesData }: { servicesData: Services }) {
  console.log(servicesData);
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
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
