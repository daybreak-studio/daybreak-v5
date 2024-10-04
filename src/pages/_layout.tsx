import Navigation from "@/components/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}
