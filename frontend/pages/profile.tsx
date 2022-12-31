/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Profile(): JSX.Element {
  const { signout, user } = useAuth();

  const router = useRouter();
  function signOut() {
    signout();
    router.push("/");
  }

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
          {/* not sure if working or not */}
          <div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="user avatar" />
            ) : (
              <svg
                width={60}
                height={60}
                xmlns="http://www.w3.org/2000/svg"
                data-name="Layer 1"
                viewBox="0 0 29 29"
              >
                <path d="M14.5 2A12.514 12.514 0 0 0 2 14.5 12.521 12.521 0 0 0 14.5 27a12.5 12.5 0 0 0 0-25Zm7.603 19.713a8.48 8.48 0 0 0-15.199.008A10.367 10.367 0 0 1 4 14.5a10.5 10.5 0 0 1 21 0 10.368 10.368 0 0 1-2.897 7.213ZM14.5 7a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 14.5 7Z" />
              </svg>
            )}
            <p>Edit profile</p>
          </div>
          <h1>{user.displayName || user.email}</h1>
          <Button onClick={signOut} text="Logout" type="primary" size="lg" />
        </>
      )}
    </div>
  );
}
