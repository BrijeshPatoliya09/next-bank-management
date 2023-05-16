import { useEffect, useState } from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const [web, setWeb] = useState(false);

  useEffect(() => {
    setTimeout(() => setWeb(true), 0);
  }, []);
  return web && <Component {...pageProps} />;
}
