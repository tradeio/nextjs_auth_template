import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import agent from "../utils/agent";

export default function ClientSideFetch() {
  const router = useRouter();
  const [query, setQuery] = useState({
    isLoading: true,
    data: null,
    err: null,
  });
  useEffect(() => {
    agent()
      .example()
      .then((res) => {
        setQuery({ isLoading: false, data: res.data, err: null });
      })
      .catch((err) => {
        setQuery({ isLoading: false, data: null, err });
      });
  }, []);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Client Side fetch</h1>
        <p className={styles.description}>
          <strong>Result:</strong>{" "}
          {query.isLoading ? "Loading..." : query.data?.message}
        </p>

        <Link href="/" passHref>
          <a>Back to Main page</a>
        </Link>
        <button
          onClick={() =>
            agent()
              .logout()
              .then(() => router.push("/login"))
          }
        >
          Logout
        </button>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
