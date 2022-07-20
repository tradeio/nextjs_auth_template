import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import styles from "../styles/Home.module.css";
import agent from "../utils/agent";

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  function redirect() {
    if (router.query.from) {
      router.push(router.query.from);
    } else {
      router.push("/");
    }
  }
  useEffect(() => {
    // This will check on load wether the user has a valid refresh token
    // if so, it will refresh the access token and redirect the user to the main page
    agent()
      .refreshAccessToken()
      .then(redirect)
      .catch()
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div className={styles.container}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.centered}>
          <h1>Login</h1>
          <LoginForm onSuccess={redirect}/>
          <Link href="/register" passHref>
            <a>Go to Register</a>
          </Link>
        </div>
      )}
    </div>
  );
}
