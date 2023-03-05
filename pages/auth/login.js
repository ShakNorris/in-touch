import { getProviders, signIn } from "next-auth/react"
import style from '../../styles/authen.module.css'
import { useState } from "react";
import { useSession } from 'next-auth/react';


export default function login({ providers }) {

  const [hasAccount, setHasAccount] = useState(false);

  const {data: session} = useSession();

  console.log(session);

  return (
    <>
    <div className={style.container}>
      <div className={style.top}></div>
      <div className={style.bottom}></div>
      <div className={style.center}>
        <h2>InTouch</h2>
        {hasAccount ? <>
        <input type="text" placeholder="First Name"  />
        <input type="text" placeholder="Last Name" />
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email"/>
        <input type="password" placeholder="Password"/>
        <input type="password" placeholder="Confirm Password"/>
        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Register
        </button>
        </>:
        <>
        <input type="text" placeholder="Email"  />
        <input type="text" placeholder="Password" />
        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Login
        </button>
        </>}
        {providers && !!Object.keys(providers).length && Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id, {callbackUrl:'/'})}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
         <p className="message">Already registered? <a onClick={()=> setHasAccount(!hasAccount)}>Sign In</a></p>
      </div>
    </div>
    </>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async () => {
  return {
    providers: await getProviders()
  }
}
*/