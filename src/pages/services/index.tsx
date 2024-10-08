import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Card from "./(components)/card";
import Layout from "@/components/layout";

const cards = [
  { title: "Brand", position: "top-left" },
  { title: "Product", position: "top-right" },
  { title: "Motion", position: "bottom-left" },
  { title: "Dev", position: "bottom-right" },
] as const;

type CardInfo = (typeof cards)[number];
type CardTitle = CardInfo["title"];

export default function Services() {
  const [selectedCard, setSelectedCard] = useState<CardTitle | null>(null);
  const [currentTransform, setCurrentTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<CardTitle, HTMLDivElement | null>>(
    Object.fromEntries(cards.map((card) => [card.title, null])) as Record<
      CardTitle,
      HTMLDivElement | null
    >,
  );

  const handleCardClick = (title: CardTitle) => {
    const cardRef = cardRefs.current[title];
    if (!cardRef || !containerRef.current) return;

    // Avoid recalculating if the same card is clicked again
    if (selectedCard === title) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = cardRef.getBoundingClientRect();

    let deltaX = 0;
    let deltaY = 0;
    let scale = currentTransform.scale;

    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;

    // Calculate the card's center relative to the parent container
    const cardCenterX = cardRect.left - containerRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top - containerRect.top + cardRect.height / 2;

    if (!selectedCard) {
      // First click: Translate the card to the center of the container and scale up
      scale = 2.5; // Apply scaling on first click

      // Calculate the translation to center the card
      deltaX = containerCenterX - cardCenterX;
      deltaY = containerCenterY - cardCenterY;
    } else {
      // Subsequent clicks: Calculate the translation between the previous and the current card
      const previousCardRef = cardRefs.current[selectedCard];
      if (previousCardRef) {
        const previousCardRect = previousCardRef.getBoundingClientRect();

        const previousCardCenterX =
          (previousCardRect.left -
            containerRect.left +
            previousCardRect.width / 2) /
          scale;
        const previousCardCenterY =
          (previousCardRect.top -
            containerRect.top +
            previousCardRect.height / 2) /
          scale;

        deltaX = previousCardCenterX - cardCenterX / scale;
        deltaY = previousCardCenterY - cardCenterY / scale;
      }
    }

    // Apply the translation and scaling
    setCurrentTransform({
      x: currentTransform.x + deltaX * scale,
      y: currentTransform.y + deltaY * scale,
      scale,
    });

    // Update the selected card
    setSelectedCard(title);
  };

  const handleShrinkClick = () => {
    setSelectedCard(null);
    setCurrentTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <Layout>
      <section className="flex h-svh w-full items-center justify-center bg-blue-500 text-center">
        Intro Section
      </section>
      <section
        className="relative h-screen origin-center overflow-hidden"
        ref={containerRef}
      >
        {/* <div className="pointer-events-none absolute inset-0 z-50">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transform bg-red-500"></div>
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 transform bg-red-500"></div>
        </div> */}
        <motion.div
          className="absolute h-full w-full origin-center"
          animate={{
            transform: `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${currentTransform.scale})`,
          }}
          transition={{ duration: 0.5, ease: "backInOut" }}
        >
          {cards.map(({ title, position }) => (
            <Card
              key={title}
              ref={(el: HTMLDivElement | null) => {
                cardRefs.current[title] = el;
              }}
              title={title}
              position={position}
              onClick={() => handleCardClick(title)}
            />
          ))}
        </motion.div>
        {selectedCard && (
          <button
            className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2 transform rounded-md bg-zinc-500 px-4 py-2 text-white hover:bg-zinc-600"
            onClick={handleShrinkClick}
          >
            Shrink
          </button>
        )}
      </section>
      <section className="flex h-svh w-full items-center justify-center bg-zinc-100 text-center">
        Testimonials
      </section>
    </Layout>
  );
}
