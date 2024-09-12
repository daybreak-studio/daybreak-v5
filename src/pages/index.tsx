import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import Drawer from "@/pages/components/Drawer";
import { useState, useEffect, useCallback } from "react";
import { useSpring } from "framer-motion";

type HomePageData = {
  missionStatement: any;
};

type HomePageProps = {
  data: HomePageData;
};

export default function Home({ data }: HomePageProps) {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <main className="relative min-h-[200vh]">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(240,240,220,1) 0%, rgba(249,221,213,1) 25%, rgba(236,236,240,1) 75%)",
        }}
      >
        <div className="flex h-screen items-center justify-center p-4">
          <h1 className="text-center text-3xl text-gray-400 xl:text-6xl">
            A technology first <br /> design studio.
          </h1>
        </div>
      </div>
      <Drawer windowHeight={windowHeight}>
        <div className="p-8 2xl:p-16">
          <h2 className="text-md mb-4 2xl:text-4xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            leo risus, vehicula id feugiat ut, convallis et nisl. Nullam auctor
            sit amet libero eu accumsan. Integer molestie felis dolor, venenatis
            lacinia nisl convallis non. Nulla hendrerit eros et nisl condimentum
            porta. In id luctus mauris. Quisque elementum tempor metus id
            scelerisque. Praesent a ex eros. Aenean nibh nisi, porta euismod
            lorem pretium, placerat pellentesque ipsum. Sed magna orci,
            consequat id nulla ut, placerat sagittis magna. Mauris eu libero
            quis neque faucibus venenatis eget non ante. Ut varius aliquet
            rutrum. Proin non mollis turpis. Aenean sollicitudin dignissim augue
            at ultrices. Aliquam faucibus mollis neque sit amet varius. Duis sit
            amet commodo neque, non imperdiet turpis. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Praesent malesuada hendrerit
            molestie. Nunc ac tempus purus. Ut a porttitor turpis. Morbi augue
            lacus, consequat in orci eu, efficitur gravida mi. Nulla felis quam,
            tempus vitae vulputate at, cursus eget felis. Duis id ligula quis
            turpis venenatis efficitur efficitur a sapien. Nulla tortor sapien,
            sollicitudin a vestibulum id, consequat et nunc. Mauris blandit id
            nibh vitae placerat. Praesent mauris orci, hendrerit et elementum
            quis, feugiat ut orci. Sed augue ipsum, venenatis at ultrices ac,
            ornare quis ipsum. Phasellus diam eros, maximus vitae augue
            bibendum, pharetra consequat urna. Etiam lobortis aliquet nibh,
            vitae mattis ex. Curabitur ac hendrerit massa. Nulla hendrerit a
            sapien id ornare. Nunc eleifend elit libero, volutpat eleifend dui
            imperdiet sit amet. Proin non nulla nec eros faucibus tristique nec
            sed felis. Donec eu pellentesque libero. Mauris malesuada arcu quis
            pulvinar facilisis. Cras varius elementum erat, sed accumsan nisi
            porttitor quis. Nullam quis rhoncus ligula, non ornare felis.
            Quisque lectus nunc, dignissim vitae feugiat at, imperdiet nec
            tellus. Nulla commodo leo commodo imperdiet vulputate. Nam tincidunt
            elementum libero eu accumsan. Ut sed nulla a erat tristique dapibus
            in non tortor. Suspendisse potenti. Sed ultricies fringilla nibh,
            eget blandit erat mattis sit amet. In hac habitasse platea dictumst.
            Nulla non sem pretium, iaculis ipsum vel, interdum velit. Phasellus
            scelerisque, libero vitae imperdiet facilisis, ex lorem consectetur
            felis, eu ullamcorper lorem orci in nunc. Nam aliquam massa eu
            volutpat porta. Ut leo mauris, accumsan nec accumsan at, porta et
            ligula. Praesent efficitur euismod accumsan. Sed dictum pellentesque
            feugiat. Morbi aliquet rhoncus est, eu tincidunt magna blandit sed.
            In viverra at arcu nec vestibulum. Morbi condimentum porta mollis.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Morbi porta iaculis urna non sodales. Donec
            eu libero id felis sollicitudin congue sed ut massa. Fusce blandit
            consectetur tellus, id commodo odio ultricies et. Nunc quam augue,
            sagittis vitae malesuada id, dictum ac mauris. Nunc vulputate
            scelerisque neque in pellentesque. Cras cursus lorem mi, id lobortis
            odio volutpat a. Nam ex velit, ornare ut feugiat sed, pretium non
            elit.
          </h2>
          <h2 className="text-md mb-4 2xl:text-4xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            leo risus, vehicula id feugiat ut, convallis et nisl. Nullam auctor
            sit amet libero eu accumsan. Integer molestie felis dolor, venenatis
            lacinia nisl convallis non. Nulla hendrerit eros et nisl condimentum
            porta. In id luctus mauris. Quisque elementum tempor metus id
            scelerisque. Praesent a ex eros. Aenean nibh nisi, porta euismod
            lorem pretium, placerat pellentesque ipsum. Sed magna orci,
            consequat id nulla ut, placerat sagittis magna. Mauris eu libero
            quis neque faucibus venenatis eget non ante. Ut varius aliquet
            rutrum. Proin non mollis turpis. Aenean sollicitudin dignissim augue
            at ultrices. Aliquam faucibus mollis neque sit amet varius. Duis sit
            amet commodo neque, non imperdiet turpis. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Praesent malesuada hendrerit
            molestie. Nunc ac tempus purus. Ut a porttitor turpis. Morbi augue
            lacus, consequat in orci eu, efficitur gravida mi. Nulla felis quam,
            tempus vitae vulputate at, cursus eget felis. Duis id ligula quis
            turpis venenatis efficitur efficitur a sapien. Nulla tortor sapien,
            sollicitudin a vestibulum id, consequat et nunc. Mauris blandit id
            nibh vitae placerat. Praesent mauris orci, hendrerit et elementum
            quis, feugiat ut orci. Sed augue ipsum, venenatis at ultrices ac,
            ornare quis ipsum. Phasellus diam eros, maximus vitae augue
            bibendum, pharetra consequat urna. Etiam lobortis aliquet nibh,
            vitae mattis ex. Curabitur ac hendrerit massa. Nulla hendrerit a
            sapien id ornare. Nunc eleifend elit libero, volutpat eleifend dui
            imperdiet sit amet. Proin non nulla nec eros faucibus tristique nec
            sed felis. Donec eu pellentesque libero. Mauris malesuada arcu quis
            pulvinar facilisis. Cras varius elementum erat, sed accumsan nisi
            porttitor quis. Nullam quis rhoncus ligula, non ornare felis.
            Quisque lectus nunc, dignissim vitae feugiat at, imperdiet nec
            tellus. Nulla commodo leo commodo imperdiet vulputate. Nam tincidunt
            elementum libero eu accumsan. Ut sed nulla a erat tristique dapibus
            in non tortor. Suspendisse potenti. Sed ultricies fringilla nibh,
            eget blandit erat mattis sit amet. In hac habitasse platea dictumst.
            Nulla non sem pretium, iaculis ipsum vel, interdum velit. Phasellus
            scelerisque, libero vitae imperdiet facilisis, ex lorem consectetur
            felis, eu ullamcorper lorem orci in nunc. Nam aliquam massa eu
            volutpat porta. Ut leo mauris, accumsan nec accumsan at, porta et
            ligula. Praesent efficitur euismod accumsan. Sed dictum pellentesque
            feugiat. Morbi aliquet rhoncus est, eu tincidunt magna blandit sed.
            In viverra at arcu nec vestibulum. Morbi condimentum porta mollis.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Morbi porta iaculis urna non sodales. Donec
            eu libero id felis sollicitudin congue sed ut massa. Fusce blandit
            consectetur tellus, id commodo odio ultricies et. Nunc quam augue,
            sagittis vitae malesuada id, dictum ac mauris. Nunc vulputate
            scelerisque neque in pellentesque. Cras cursus lorem mi, id lobortis
            odio volutpat a. Nam ex velit, ornare ut feugiat sed, pretium non
            elit.
          </h2>

          {/* Add more content here to make it scrollable */}
        </div>
      </Drawer>
    </main>
  );
}
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const query = `*[_type == "home"][0]`;
  const data = await client.fetch(query);

  return {
    props: {
      data,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};
