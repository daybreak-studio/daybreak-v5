import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data structure
const MOCK_SERVICES = [
  {
    id: "brand",
    name: "Brand",
    tabs: [
      {
        _key: "campaign",
        heading: "Campaign",
        subheading: "Craft your brand narrative",
        copy: "Strategic campaigns that capture attention and drive results, crafted to resonate with your target audience and create lasting impact.",
      },
      {
        _key: "rebrand",
        heading: "Rebrand",
        subheading: "Shape your next chapter",
        copy: "Revitalize your brand identity for the modern landscape while preserving your core values and building stronger connections with your audience.",
      },
      {
        _key: "reposition",
        heading: "Reposition",
        subheading: "Capture your new market",
        copy: "Shift market perception and reach new audiences by strategically repositioning your brand to capture untapped opportunities and drive growth.",
      },
    ],
  },
  {
    id: "product",
    name: "Product",
    tabs: [
      {
        _key: "design",
        heading: "Design",
        subheading: "Design tomorrow's products",
        copy: "Beautiful, intuitive products that users love, built with meticulous attention to detail and focused on delivering exceptional user experiences.",
      },
      {
        _key: "research",
        heading: "Research",
        subheading: "Understanding user needs",
        copy: "Data-driven user research that uncovers real insights, helping you make confident product decisions and reduce time to market.",
      },
      {
        _key: "testing",
        heading: "Testing",
        subheading: "Iterate with confidence",
        copy: "Rapid user testing cycles that ensure product-market fit, turning user feedback into actionable improvements that drive product adoption.",
      },
    ],
  },
  {
    id: "motion",
    name: "Motion",
    tabs: [
      {
        _key: "launch",
        heading: "Launch",
        subheading: "Bring your product to life",
        copy: "Compelling product launch videos that showcase your innovation, designed to captivate investors and early adopters.",
      },
      {
        _key: "interactive",
        heading: "Interactive",
        subheading: "Interfaces that spark joy",
        copy: "Thoughtfully crafted UI animations that elevate user experiences, bringing interfaces to life with delightful micro-interactions.",
      },
      {
        _key: "marketing",
        heading: "Marketing",
        subheading: "Highlight your product's features",
        copy: "Engaging product demonstrations and UI animations that communicate value clearly, helping you stand out in a crowded market.",
      },
    ],
  },
  {
    id: "development",
    name: "Development",
    tabs: [
      {
        _key: "landing",
        heading: "Landing",
        subheading: "Launch unforgettable products",
        copy: "Bold, memorable landing pages that make a lasting first impression, turning curious visitors into customers.",
      },
      {
        _key: "content",
        heading: "Content",
        subheading: "Build your digital presence",
        copy: "Richly crafted blogs and editorial experiences that elevate your brand's voice, creating meaningful connections with your audience through digital-first storytelling.",
      },
      {
        _key: "microsites",
        heading: "Microsites",
        subheading: "Create interactive campaigns",
        copy: "Immerse your audience in campaign experiences that push creative boundaries, transforming brand touch points into interactive journeys that users want to explore and share.",
      },
    ],
  },
];

interface Tab {
  _key: string;
  heading: string;
  subheading: string;
  copy: string;
}

interface Service {
  id: string;
  name: string;
  tabs: Tab[];
}

// Fixed positions in 3D space
const POSITIONS = [
  {
    // Front
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    zIndex: 4,
  },
  {
    // First stack
    x: 15,
    y: 12,
    scale: 0.95,
    rotate: 2,
    zIndex: 3,
  },
  {
    // Second stack
    x: 30,
    y: 24,
    scale: 0.9,
    rotate: 4,
    zIndex: 2,
  },
  {
    // Back
    x: 45,
    y: 36,
    scale: 0.85,
    rotate: 6,
    zIndex: 1,
  },
];

export default function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabStates, setTabStates] = useState<Record<string, number>>(
    MOCK_SERVICES.reduce((acc, service) => ({ ...acc, [service.id]: 0 }), {}),
  );

  const getCardPosition = (index: number) => {
    // Calculate how far this card is from the active card
    const distance =
      (index - activeIndex + MOCK_SERVICES.length) % MOCK_SERVICES.length;
    return POSITIONS[distance];
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % MOCK_SERVICES.length);
  };

  const handlePrevious = () => {
    setActiveIndex(
      (prev) => (prev - 1 + MOCK_SERVICES.length) % MOCK_SERVICES.length,
    );
  };

  const handleTabChange = (serviceId: string, tabIndex: number) => {
    setTabStates((prev) => ({ ...prev, [serviceId]: tabIndex }));
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4">
      <div className="relative h-[100vh] sm:h-[600px]">
        {MOCK_SERVICES.map((service, index) => {
          const position = getCardPosition(index);
          const isActive = index === activeIndex;
          const currentTab = tabStates[service.id];

          return (
            <motion.div
              key={service.id}
              className="absolute inset-0"
              style={{ zIndex: position.zIndex }}
              animate={{
                x: position.x,
                y: position.y,
                scale: position.scale,
                rotate: position.rotate,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-8">
                  <div className="flex flex-col">
                    <h3 className="mb-4 text-lg font-medium text-gray-400">
                      {service.name}
                    </h3>

                    <div className="mb-8">
                      <div className="flex gap-6">
                        {service.tabs.map((tab, idx) => (
                          <button
                            key={tab._key}
                            onClick={() =>
                              isActive && handleTabChange(service.id, idx)
                            }
                            className={`relative py-2 ${
                              idx === currentTab
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            disabled={!isActive}
                          >
                            {tab.heading}
                            {idx === currentTab && (
                              <motion.div
                                layoutId={`activeTab-${service.id}`}
                                className="absolute -bottom-px left-0 right-0 h-px bg-black"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      key={`${service.id}-${currentTab}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-[2.5rem] font-normal leading-tight">
                        {service.tabs[currentTab].subheading}
                      </h2>
                      <p className="mt-4 text-gray-600">
                        {service.tabs[currentTab].copy}
                      </p>
                    </motion.div>
                  </div>

                  <div className="aspect-square rounded-xl bg-gray-100" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-8 inset-y-0 z-50 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="pointer-events-auto rounded-full bg-white p-3 shadow-lg"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="pointer-events-auto rounded-full bg-white p-3 shadow-lg"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
