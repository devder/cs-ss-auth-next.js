import "tailwindcss/tailwind.css";
import Head from "next/head";

import type { AppProps } from "next/app";
import Navbar from "src/components/navbar";
import { UserProvider } from "src/context/user-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className="h-screen">
        <Head>
          <title>Token Auth With Next</title>
          <meta name="description" content="CRS and SSR Authentication with Next.js" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </UserProvider>
  );
}

export default MyApp;
