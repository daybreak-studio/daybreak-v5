import { useRouter } from "next/router";

export const usePathname = () => {
  const router = useRouter();
  const isHomeRoute = router.pathname === "/";
  const currentPath = router.pathname;
  const basePath = `/${router.pathname.split("/")[1]}`;

  return {
    isHomeRoute,
    currentPath,
    basePath,
  };
};
