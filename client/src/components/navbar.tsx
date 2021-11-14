import Link from "next/link";
import { FC } from "react";
import { useRouter } from "next/router";

const Navbar: FC = () => {
  const router = useRouter();

  const yieldLinkStyle = (route: string): string => {
    return router.pathname === route ? "text-gray-900" : "";
  };

  return (
    <div className="fixed top-0 w-full">
      <div className="flex justify-center p-4 space-x-4 text-sm text-gray-500">
        <Link href="/">
          <a className={yieldLinkStyle("/")}>Home</a>
        </Link>
        <Link href="/me">
          <a className={yieldLinkStyle("/me")}>CSR</a>
        </Link>
        <Link href="/me-ssr">
          <a className={yieldLinkStyle("/me-ssr")}>SSR</a>
        </Link>
        <Link href="/realtime">
          <a className={yieldLinkStyle("/realtime")}>Realtime</a>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
