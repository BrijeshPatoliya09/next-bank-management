import { useEffect, useState } from "react";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import AdminLayout from "../component/admin/AdminLayout";
import UserLayout from "../component/user/UserLayout";

export default function App({ Component, pageProps }) {
  const [web, setWeb] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setWeb(true), 100);
  }, []);
  return (
    <>
      {web && (
        <>
          {router.pathname.includes("admin") ? (
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          ) : (
            <UserLayout>
              <Component {...pageProps} />
            </UserLayout>
          )}
        </>
      )}
    </>
  );
}
