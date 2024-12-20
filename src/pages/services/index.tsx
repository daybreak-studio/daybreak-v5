import ServicesCarousel from "@/components/services-carousel";
import { WidgetGrid } from "@/components/widgets/grid";
import { WidgetDataProvider } from "@/components/widgets/grid/context";
import { Widget, WidgetRegistry } from "@/components/widgets/grid/types";
import MediaWidget from "@/components/widgets/variants/media";
import type { Services } from "@/sanity/types";
const servicesWidgets: WidgetRegistry = {
  media: MediaWidget,
};

export default function Services({ servicesData }: { servicesData: Services }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <WidgetDataProvider data={{ widgets: servicesData.widgets as Widget[] }}>
        <WidgetGrid components={servicesWidgets} />
      </WidgetDataProvider>
      {/* <ServicesCarousel /> */}
    </div>
  );
}
