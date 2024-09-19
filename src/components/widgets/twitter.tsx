import { useWidgetGridContext } from "@/components/grid/hooks";

const Twitter = () => {
  const { size } = useWidgetGridContext();
  return (
    <div>
      <h1>Twitter {size.w}</h1>
    </div>
  );
};

export default Twitter;
