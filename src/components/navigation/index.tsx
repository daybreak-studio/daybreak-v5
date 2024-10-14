import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

interface Tab {
  id: string;
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { id: "works", label: "Works", path: "/works" },
  { id: "grid", label: "Grid", path: "/grid" },
];

export default function Navigation() {
  const router = useRouter();
  const activePath = router.asPath;

  return (
    <nav className="bg-green-400 p-4">
      <div className="flex flex-wrap space-x-1">
        {tabs.map((tab) => {
          const isActive = activePath === tab.path;
          return (
            <Link key={tab.id} href={tab.path} legacyBehavior>
              <a
                aria-current={isActive ? "page" : undefined}
                className={`${
                  isActive ? "" : "hover:text-white/60"
                } relative rounded-full px-3 py-1.5 text-sm font-medium text-gray-50 outline-sky-400 transition focus-visible:outline-2`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 z-10 bg-white mix-blend-difference"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
