import EmblaCarousel from "./js/embla-carousel";
import { EmblaOptionsType } from "embla-carousel";
import { v4 as uuidv4 } from "uuid";

import "./css/sandbox.css";
import "./css/embla.css";
import { people } from "./data";

export default function Page() {
  return (
    <div className="fixed inset-0 z-0">
      <EmblaCarousel people={people} options={{ loop: true }} />;
    </div>
  );
}
