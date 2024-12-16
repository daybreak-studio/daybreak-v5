import { useRouter } from "next/router";

export const useHomeRoute = () => {
  const router = useRouter();
  const isHomeRoute = router.pathname === "/";
  const currentPath = router.pathname;

  return {
    isHomeRoute,
    currentPath,
  };
};
