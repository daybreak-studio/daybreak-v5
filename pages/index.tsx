import WidgetGrid from "./_/Widget/WidgetGrid";
import Widget from "./_/Widget/Widget";
import SnapArea from "../components/Snapping/SnapArea";

export default function Home() {
  return (
    <main>
      <section className="bg-gray-50">
        <WidgetGrid>
          <Widget size="lg" position={{
            narrow: { col: 0, row: 0 },
            wide: { col: 2, row: 0 }
          }}>
            3x3 widget (orange with silhouette)
          </Widget>

          <Widget size="sm" position={{
            narrow: { col: 3, row: 1 },
            wide: { col: 1, row: 0 }
          }}>
            1x1 widget (white with squares)
          </Widget>

          <Widget size="sm" position={{
            narrow: { col: 3, row: 4 },
            wide: { col: 5, row: 2 }
          }}>
            1x1 widget (temperature 26°C)
          </Widget>

          <Widget size="md" position={{
            narrow: { col: 1, row: 3 },
            wide: { col: 0, row: 1 }
          }}>
            2x2 widget (multicolor gradient)
          </Widget>

          <Widget size="md" position={{
            narrow: { col: 3, row: 2 },
            wide: { col: 5, row: 0 }
          }}>
            2x2 widget (yellow gradient with text)
          </Widget>
        </WidgetGrid>

        <SnapArea className="h-[200vh] bg-black rounded-xl drop-shadow-2xl">
          content
        </SnapArea>
      </section>
    </main >
  );
}
