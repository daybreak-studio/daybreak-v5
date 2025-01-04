import ServicesCarousel from "@/components/services-carousel";
import { WidgetGrid } from "@/components/widgets/grid";
import { WidgetDataProvider } from "@/components/widgets/grid/context";
import { Widget, WidgetRegistry } from "@/components/widgets/grid/types";
import MediaWidget from "@/components/widgets/variants/media";
import { client } from "@/sanity/lib/client";
import type { Services } from "@/sanity/types";
import { GetStaticProps } from "next";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
const servicesWidgets: WidgetRegistry = {
  media: MediaWidget,
};

export default function Services({ servicesData }: { servicesData: Services }) {
  console.log(servicesData);
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
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
