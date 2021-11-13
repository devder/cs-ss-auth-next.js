import "tailwindcss/tailwind.css";
import Head from "next/head";

import type { AppProps } from "next/app";
import Navbar from "components/navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen">
      <Head>
        <title>Token Auth With Next</title>
        <meta name="description" content="CRS and SSR Authentication with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
