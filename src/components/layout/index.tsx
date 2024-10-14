// components/Layout.tsx

import { ReactNode } from "react";
import Navigation from "../navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navigation />
      <main className="p-4">{children}</main>
    </>
  );
}
