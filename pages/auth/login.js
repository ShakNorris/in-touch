import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import style from "../../styles/authen.module.css";
import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import Register from "../../components/Register";
import Authorize from "../../components/Authorize";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Group,
  Button,
  HoverCard,
  Text,
  Avatar,
  Image,
} from "@mantine/core";

export default function login({ providers }) {
  const [hasAccount, setHasAccount] = useState(false);
  const [passwordModal, { open, close }] = useDisclosure(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push({
        pathname: "/",
      });
    }
    return () => {};
  }, []);

  var generator = require("generate-password");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const PasswordGenerator = () => {
    var tempPassword = generator.generate({
      length: Math.floor(Math.random() * (12 - 8 + 1) + 8),
      numbers: true,
      strict: true,
    });
    setGeneratedPassword(tempPassword);
    open();
  };

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <>
      <Head>
        <title>InTouch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen bg-gradient-to-r from-[#BFF098] to-[#6FD6FF]">
        <div className="m-auto bg-slate-50 rounded-md w-3/5 h-4/5 grid lg:grid-cols-2">
          <div className={style.imgStyle}>
            <div className={style.backgroundAnimation}></div>
            <div></div>
          </div>
          <div className="right flex flex-col justify-evenly">
            
            <div className="text-center py-10">
              <section className="w-3/4 mx-auto flex flex-col">
                <h2 className={style.loginName}>InTouch</h2>
                {hasAccount ? (
                  <>
                    <Register />
                    <Modal
                      opened={passwordModal}
                      onClose={close}
                      title="Password Generator"
                      centered
                    >
                      Your Generated Password is - {generatedPassword}
                    </Modal>

                    <Group position="center">
                      <Button
                        className="mt-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4"
                        onClick={PasswordGenerator}
                      >
                        Generate Password
                      </Button>
                    </Group>
                  </>
                ) : (
                  <>
                    <Authorize />
                    <button
                      className={style.providerBtn}
                      type="button"
                      onClick={handleGoogleSignin}
                    >
                      Sign in with Google
                    </button>
                    {/* {providers &&
                      !!Object.keys(providers).length &&
                      Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                          <button
                            className={style.providerBtn}
                            type="button"
                            onClick={() =>
                              signIn(provider.id, { callbackUrl: "/" })
                            }
                          >
                            Sign in with {provider.name}
                          </button>
                        </div>
                      ))} */}
                  </>
                )}
              </section>
              <p className="text-center text-gray-500 mt-4">
                {hasAccount ? (
                  <>
                    Already registered?{" "}
                    <a
                      className="text-blue-500 cursor-pointer"
                      onClick={() => setHasAccount(!hasAccount)}
                    >
                      Sign In
                    </a>
                  </>
                ) : (
                  <>
                    Don't have an Account?{" "}
                    <a
                      className="text-blue-500 cursor-pointer"
                      onClick={() => setHasAccount(!hasAccount)}
                    >
                      Sign Up
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const providers = await getProviders();
  return {
    props: { providers },
  };
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async () => {
  return {
    providers: await getProviders()
  }
}
*/
