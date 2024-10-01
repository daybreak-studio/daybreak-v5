import React from "react";
import ZoomGrid from "@/components/zoom-grid";

const App: React.FC = () => {
  const gridItems = [
    { width: 200, height: 300 },
    { width: 200, height: 300 },
    { width: 200, height: 300 },
    { width: 200, height: 300 },
  ];

  return (
    <div>
      <ZoomGrid
        items={gridItems}
        scaleFactor={3} // Custom scale factor
        gapSize={15} // Custom gap size
        renderItem={(item, index) => (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: index % 2 === 0 ? "#1abc9c" : "#9b59b6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "24px",
            }}
          >
            Item {index + 1}
          </div>
        )}
      />
    </div>
  );
};

export default App;
