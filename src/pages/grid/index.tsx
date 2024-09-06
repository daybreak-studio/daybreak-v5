import React from "react";
import Grid, { useWidgetContext } from "@/pages/components/Grid";

const ContentComponent: React.FC = () => {
  const { size } = useWidgetContext();

  return (
    <div className="flex h-full items-center justify-center">
      <span className="font-semibold capitalize">{size}</span>
    </div>
  );
};

export default function Example() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Grid.Layout>
        <Grid.Widget size="large">
          <ContentComponent />
        </Grid.Widget>

        <Grid.Widget size="medium">
          <ContentComponent />
        </Grid.Widget>

        <Grid.Widget size="small">
          <ContentComponent />
        </Grid.Widget>

        <Grid.Widget size="small">
          <ContentComponent />
        </Grid.Widget>
      </Grid.Layout>
    </div>
  );
}
