import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import style from "../../styles/authen.module.css";
import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import {SiAuth0} from 'react-icons/si'

export default function login({ providers }) {
  const [email, setEmail] = useState(null);
  const [passwordModal, { open, close }] = useDisclosure(false);
  const { data: session } = useSession();
  const router = useRouter();

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
      length: Math.floor(Math.random() * (18 - 14 + 1) + 14),
      numbers: true,
      strict: true,
    });
    setGeneratedPassword(tempPassword);
    open();
  };

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "/" });
  }

  async function handleGithubSignin() {
    signIn("github", { callbackUrl: "/" });
  }

  async function handleEmailSignin() {
    signIn("email", { email: email });
  }

  async function handleAuth0Signin() {
    signIn("auth0", { callbackUrl: "/" });
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

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div>
                  <button
                    type="button"
                    onClick={handleEmailSignin}
                    className={style.providerBtn}
                  >
                    Sign In with Email
                    <AiOutlineMail className="h-5 w-5 ml-1" />
                  </button>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleGoogleSignin}
                    className={style.providerBtn}
                  >
                    Sign In with Google <FcGoogle className="h-5 w-5 ml-1" />
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleGithubSignin}
                    className={style.providerBtn}
                  >
                    Sign In with Github
                    <FaGithub className="h-5 w-5 ml-1" />
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleAuth0Signin}
                    className={style.providerBtn}
                  >
                    Sign In with Auth0
                    <SiAuth0 className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </section>
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
