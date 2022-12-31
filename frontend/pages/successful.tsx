import React from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function SuccessfulRegister(): JSX.Element {
  const { user } = useAuth();

  return (
    <div>
      <h1>You have successfuly registered as {user && user.email}</h1>
      <Link href="/">
        <button>Go HOME</button>
      </Link>
    </div>
  );
}
