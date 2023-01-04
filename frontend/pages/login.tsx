import Head from "next/head";
import React, { useState } from "react";
import Button from "../components/Button";
import Link from "next/link";
import { setToken, unsetToken } from "lib/auth";
import { useAuth, useFetchUser } from "context/AuthContext";

const Login = (): JSX.Element => {
  const [userData, setUserData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }
  );
  const { user, loading } = useFetchUser();
  const [errorMessage, setErrorMessage] = useState<string>("");
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  const handleSubmit = async () => {
    const responseData = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: userData.email,
          password: userData.password,
        }),
      }
    );

    const response = await responseData.json();
    setToken(response);
  };

  if (user) {
    return (
      <div>
        <h1>You are already logged in as {user}</h1>
        <button onClick={unsetToken}>Logout</button>
      </div>
    );
  }
  return (
    <div className="pt-16 pb-32">
      <Head>
        <title>E-shop Login Page</title>
        <meta name="description" content="E-shop e-commerce webpage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl text-center text-primary-200 font-semibold ">
        Login
      </h1>
      <div className="flex flex-col px-10 space-y-12 pt-16">
        {errorMessage && (
          <h1 className="text-danger-500 text-center">{errorMessage}</h1>
        )}
        <div className="flex flex-col">
          {/* <label className="text-neutral-200 " htmlFor="email">
            Email
          </label> */}
          <input
            className="border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
            id="email"
            name="email"
            // type="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          {/* <label className="text-neutral-200 " htmlFor="password">
            Password
          </label> */}
          <input
            className="border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
            // type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <div className="pt-12">
            <Button
              text="Login"
              type="primary"
              size="lg"
              onClick={handleSubmit}
            />
          </div>
          <div className="flex justify-center space-x-2 text-center pt-2 text-neutral-400 ">
            <p>Not a client yet?</p>
            <Link href="/register">
              <span className="text-secondary-600 hover-hover:hover:text-secondary-500 font-semibold cursor-pointer transition-all">
                Sign Up!
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
