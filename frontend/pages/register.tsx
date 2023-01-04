import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useFetchUser } from "../context/AuthContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { setToken, unsetToken } from "lib/auth";
import Head from "next/head";
import Button from "components/Button";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { CREATE_CART } from "gqlQueries";
import { client } from "./_app";

export default function Register() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Can't be empty"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Can't be empty"),
    password: Yup.string().required("Can't be empty"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords do not match")
      .required("Can't be empty"),
  });

  const onSubmit = (values: any) => {};

  const router = useRouter();

  const { user, loading } = useFetchUser();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setErrorMessage((prev) => {
      return { ...prev, [name]: "" };
    });
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit() {
    setErrorMessage(initialValues);
    // if (userData.password !== userData.confirmPassword) {
    //   setErrorMessage((prev) => {
    //     return { ...prev, password: "Passwords do not match" };
    //   });
    // }

    const responseData = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      }
    );

    const response = await responseData.json();

    const id = response.user.id;
    const token = response.jwt;
    console.log(id, token);
    client.mutate({
      mutation: CREATE_CART,
      variables: { user: id },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    setToken(response);
  }

  if (user) {
    return (
      <div>
        <h1>You are already logged in as {user}</h1>
        <button onClick={unsetToken}>Logout</button>
      </div>
    );
  }

  // return (
  //   <>
  //     <Formik
  //       initialValues={initialValues}
  //       validationSchema={validationSchema}
  //       onSubmit={onSubmit}
  //     >
  //       {(formik) => {
  //         return <Form></Form>;
  //       }}
  //     </Formik>
  //   </>
  // );

  return (
    <div className="pt-12">
      <Head>
        <title>E-shop Register Page</title>
        <meta name="description" content="E-shop e-commerce webpage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-2xl text-center text-primary-200 font-semibold ">
        Register
      </h1>
      <div className="flex flex-col px-10 space-y-12 pt-12">
        <div className="flex flex-col">
          {/* <label className="text-neutral-200 " htmlFor="username">
            Username
          </label> */}
          <input
            className="border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
            id="username"
            name="username"
            // type="email"
            placeholder="Username"
            onChange={handleChange}
          />
          <h1
            className={
              errorMessage.username ? "text-danger-500 text-right" : "opacity-0"
            }
          >
            {errorMessage.username}
          </h1>
        </div>
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
          <h1
            className={
              errorMessage.email ? "text-danger-500 text-right" : "opacity-0"
            }
          >
            {errorMessage.email}
          </h1>
        </div>
        <div className="flex flex-col">
          {/* <label className="text-neutral-200 " htmlFor="password">
            Password
          </label> */}
          <input
            className={
              errorMessage.password
                ? "border-b rounded-sm p-2 text-danger-500 border-danger-500 focus:border-danger-600 placeholder:text-danger-500"
                : "border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
            }
            // type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <h1
            className={
              errorMessage.password ? "text-danger-500 text-right" : "opacity-0"
            }
          >
            {errorMessage.password}
          </h1>
        </div>
        <div className="flex flex-col">
          {/* <label className="text-neutral-200 " htmlFor="password">
            Password
          </label> */}
          <input
            className="border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
            // type="password"
            id="password"
            name="repeatPassword"
            placeholder="Confirm password"
            onChange={handleChange}
          />
          <h1
            className={
              errorMessage.confirmPassword
                ? "text-danger-500 text-right"
                : "opacity-0"
            }
          >
            {errorMessage.confirmPassword}
          </h1>
        </div>
        <div className="pt-12">
          <Button
            text="Register"
            type="primary"
            size="lg"
            onClick={handleSubmit}
          />
        </div>
        <div className="flex justify-center space-x-2 text-center pt-2 ">
          <p>Already a client?</p>
          <Link href="/login">
            <span className="text-secondary-500 font-semibold cursor-pointer">
              Log In!
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
