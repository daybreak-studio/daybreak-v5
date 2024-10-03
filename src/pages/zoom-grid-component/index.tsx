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
    { width: 300, height: 300, content: <CustomComponent /> },
    { width: 300, height: 300, content: <CustomComponent /> },
    { width: 300, height: 300, content: <CustomComponent /> },
    { width: 300, height: 300, content: <CustomComponent /> },
  ];

  return (
    <div className="flex h-screen items-center justify-center">
      <ZoomGrid items={gridItems} />
    </div>
  );
};

export default App;
