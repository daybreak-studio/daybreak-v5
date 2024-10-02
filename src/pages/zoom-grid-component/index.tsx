import React from "react";
import ZoomGrid, { ZoomContext } from "@/components/zoom-grid";

const CustomComponent: React.FC = () => {
  const { isZoomedIn } = React.useContext(ZoomContext);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: isZoomedIn ? "#e74c3c" : "#3498db",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "24px",
      }}
    >
      {isZoomedIn ? "Zoomed In" : "Zoomed Out"}
    </div>
  );
};

const App: React.FC = () => {
  const gridItems = [
    { width: 200, height: 300, content: <CustomComponent /> },
    { width: 250, height: 250, content: <CustomComponent /> },
    { width: 150, height: 350, content: <CustomComponent /> },
    { width: 300, height: 200, content: <CustomComponent /> },
  ];

  return (
    <div>
      <ZoomGrid items={gridItems} />
    </div>
  );
};

export default App;
