import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";

export default function Register() {
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Can't be empty"),
    password: Yup.string().required("Can't be empty"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords do not match")
      .required("Can't be empty"),
  });

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const router = useRouter();

  const { register, user, signout } = useAuth();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState({
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
    if (userData.password !== userData.confirmPassword) {
      setErrorMessage((prev) => {
        return { ...prev, password: "Passwords do not match" };
      });
    }
    try {
      await register(userData.email, userData.password);
      router.push("../successful");
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        console.log(error.code);
        setErrorMessage((prev) => {
          return { ...prev, email: "Invalid email" };
        });
      }
      if (error.code === "auth/weak-password") {
        console.log(error.code);
        setErrorMessage((prev) => {
          return { ...prev, password: "Weak password" };
        });
      }
      if (error.code === "auth/email-already-in-use") {
        console.log(error.code);
        setErrorMessage((prev) => {
          return { ...prev, email: "Email already in use" };
        });
      }
    }
  }

  if (user) {
    return (
      <div>
        <h1>You are already logged in as {user.email}</h1>
        <button onClick={signout}>Logout</button>
      </div>
    );
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return <Form></Form>;
        }}
      </Formik>
    </>
  );

  // return (
  //   <div className="pt-12">
  //     <Head>
  //       <title>E-shop Register Page</title>
  //       <meta name="description" content="E-shop e-commerce webpage" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>
  //     <h1 className="text-2xl text-center text-primary-200 font-semibold ">
  //       Register
  //     </h1>
  //     <div className="flex flex-col px-10 space-y-12 pt-12">
  //       <div className="flex flex-col">
  //         {/* <label className="text-neutral-200 " htmlFor="email">
  //           Email
  //         </label> */}
  //         <input
  //           className="border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
  //           id="email"
  //           name="email"
  //           // type="email"
  //           placeholder="Email"
  //           onChange={handleChange}
  //         />
  //         <h1
  //           className={
  //             errorMessage.email ? "text-danger-500 text-right" : "opacity-0"
  //           }
  //         >
  //           {errorMessage.email}
  //         </h1>
  //       </div>
  //       <div className="flex flex-col">
  //         {/* <label className="text-neutral-200 " htmlFor="password">
  //           Password
  //         </label> */}
  //         <input
  //           className={
  //             errorMessage.password
  //               ? "border-b rounded-sm p-2 text-danger-500 border-danger-500 focus:border-danger-600 placeholder:text-danger-500"
  //               : "border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
  //           }
  //           // type="password"
  //           id="password"
  //           name="password"
  //           placeholder="Password"
  //           onChange={handleChange}
  //         />
  //         <h1
  //           className={
  //             errorMessage.password ? "text-danger-500 text-right" : "opacity-0"
  //           }
  //         >
  //           {errorMessage.password}
  //         </h1>
  //       </div>
  //       <div className="flex flex-col">
  //         {/* <label className="text-neutral-200 " htmlFor="password">
  //           Password
  //         </label> */}
  //         <input
  //           className="border-b border-neutral-500 rounded-sm p-2 focus:border-primary-600"
  //           // type="password"
  //           id="password"
  //           name="repeatPassword"
  //           placeholder="Confirm password"
  //           onChange={handleChange}
  //         />
  //         <h1
  //           className={
  //             errorMessage.repeatPassword
  //               ? "text-danger-500 text-right"
  //               : "opacity-0"
  //           }
  //         >
  //           {errorMessage.repeatPassword}
  //         </h1>
  //       </div>
  //       <div className="pt-12">
  //         <Button
  //           text="Register"
  //           type="primary"
  //           size="lg"
  //           onClick={handleSubmit}
  //         />
  //       </div>
  //       <div className="flex justify-center space-x-2 text-center pt-2 ">
  //         <p>Already a client?</p>
  //         <Link href="/login">
  //           <span className="text-secondary-500 font-semibold cursor-pointer">
  //             Log In!
  //           </span>
  //         </Link>
  //       </div>
  //     </div>
  //   </div>
  // );
}
