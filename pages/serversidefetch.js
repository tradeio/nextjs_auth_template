import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import agent from "../utils/agent";

export default function ServerSideFetch({ data, error }) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Server Side fetch</h1>
        <p className={styles.description}>
          <strong>Result:</strong> {data && data.message}
        </p>
        {error && <div className="error">{error.message}</div>}

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

/**
 *
 * @param {import("next").GetServerSidePropsContext} context
 * @returns
 */
export async function getServerSideProps(context) {
  let data = {};
  let error = null;
  try {
    data = await agent(context)
      .example()
      .then((res) => res.data);
  } catch (err) {
    if ([401, 403].includes(err?.response?.status)) {
      return {
        redirect: {
          permanent: false,
          destination: context.resolvedUrl
            ? `/login?from=${context.resolvedUrl}`
            : "/login",
        },
      };
    }
    error = err?.response?.data;
  }
  return {
    props: { data, error },
  };
}
