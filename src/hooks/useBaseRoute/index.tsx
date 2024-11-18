import { useRouter } from "next/router";

export function useBaseRoute() {
  const router = useRouter();

  // Get the first segment of the path (or empty string for home page)
  const firstSegment = router.asPath.split("/")[1];

  // Check if we're on a base route (no additional segments)
  const isBaseRoute = !router.asPath.split("/")[2];

  return {
    isBaseRoute,
    currentBasePath: `/${firstSegment || ""}`,
    fullPath: router.asPath,
  };
}
