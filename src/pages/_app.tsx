import "@/styles/globals.css";
import { AppProps } from "next/app";
import { lazy, Suspense } from "react";
import { ReactLenis } from "lenis/react";

const VisualEditing = lazy(() =>
  import("@sanity/visual-editing/next-pages-router").then((mod) => ({
    default: mod.VisualEditing,
  })),
);

export interface SharedPageProps {
  preview: boolean;
}

export default function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { preview } = pageProps;

  return preview ? (
    <>
      <Component {...pageProps} />
      <Suspense fallback={null}>
        <VisualEditing />
      </Suspense>
    </>
  ) : (
    <ReactLenis root options={{ lerp: 0.5 }}>
      <Component {...pageProps} />
    </ReactLenis>
  );
}
