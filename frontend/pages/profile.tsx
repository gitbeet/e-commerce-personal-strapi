/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Head from "next/head";
import Button from "../components/Button";
import { useFetchUser } from "../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { unsetToken } from "lib/auth";
import { getTokenFromServerCookie } from "lib/auth";
import { fetcher } from "lib/api";
import { GetServerSidePropsContext } from "next";
export default function Profile({ avatar }: { avatar: string }): JSX.Element {
  const { user, loading } = useFetchUser();
  const [image, setImage] = useState(null);

  const router = useRouter();

  const uploadToClient = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const tempImage = e.target.files[0];
      setImage(tempImage);
    }
  };

  const uploadToServer = async () => {
    const formData = new FormData();
    const file: any = image;
    formData.append("inputFile", file);
    formData.append("user_id", "");
    try {
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return (
    <div>
      <Head>
        <title>E-shop Profile Page</title>
        <meta name="description" content="E-shop e-commerce webpage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!user && (
        <>
          You are not logged in.{" "}
          <Link href={"/login"}>
            <span className="cursor-pointer text-secondary-500 font-semibold">
              Log in
            </span>
          </Link>
        </>
      )}
      {user && (
        <>
          <h1 className="text-center py-6">Profile page</h1>
          {avatar === "default_avatar" && (
            <div>
              <h4>Select image to upload</h4>
              <input type="file" onChange={uploadToClient} />
              <button onClick={uploadToServer}>Set Profile Image</button>
            </div>
          )}
          <div>
            <p>Edit profile</p>
          </div>
          <Button onClick={unsetToken} text="Logout" type="primary" size="lg" />
        </>
      )}
    </div>
  );
}
// THE REQUEST CONTAINS THE COOKIE WITH OUR JWT , SO BY CHECKING THE REQUEST WE ASSURE THAT WE ARE SENDING THE JWT
// IF THERES NO JWT THE SERVER REDIRECTS US BEFORE LOADING THE PAGE
// IF THERES JWT GET THE AVATAR FOR THE LOGGED IN USER
export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const jwt = getTokenFromServerCookie(req);
  if (!jwt) {
    return {
      redirect: {
        destination: "/",
      },
    };
  } else {
    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const avatar = responseData.avatar ? responseData.avatar : "default_avatar";
    return {
      props: {
        avatar,
      },
    };
  }
}
