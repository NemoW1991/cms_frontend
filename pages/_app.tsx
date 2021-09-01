import Head from 'next/head';
import '../styles/globals.css';
// import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <meta charSet="utf-8" />
      <title>Online Education</title>
      <meta key="description" name="description" content="Online Education System" />
    </Head>
    <Component {...pageProps} />
    </>
  )
}
export default MyApp
