import "@/styles/globals.css";
import { VisualEditing } from "@sanity/visual-editing/next-pages-router";

import { AppProps } from "next/app";
import { lazy, Suspense } from "react";

import { ReactLenis } from "lenis/react";

export interface SharedPageProps {
  draftMode: boolean;
  token: string;
}

const PreviewProvider = lazy(
  () => import("@/sanity/components/PreviewProvider"),
);

export default function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps;

  return draftMode ? (
    <PreviewProvider token={token}>
      <Component {...pageProps} />
      <Suspense>
        <VisualEditing />
      </Suspense>
    </PreviewProvider>
  ) : (
    <ReactLenis root options={{ lerp: 0.5 }}>
      <Component {...pageProps} />
    </ReactLenis>
  );
}
