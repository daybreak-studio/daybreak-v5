import "./globals.css";
import { AppProps } from "next/app";
import SnappingProvider from "../components/Snapping/SnappingProvider";
import { ReactLenis, useLenis } from 'lenis/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactLenis root options={{ lerp: 0.5 }}>
      <SnappingProvider>
        <Component {...pageProps} />
      </SnappingProvider>
    </ReactLenis>
  )
}
