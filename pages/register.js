import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import styles from "../styles/Home.module.css";

export default function Register() {
  const router = useRouter();
  function redirect() {
    if (router.query.from) {
      router.push(router.query.from);
    } else {
      router.push("/");
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        <h1>Register</h1>
        <RegisterForm onSuccess={redirect} />
        <Link href="/login" passHref>
          <a>Go to Login</a>
        </Link>
      </div>
    </div>
  );
}
