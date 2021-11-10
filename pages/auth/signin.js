import { getProviders, signIn } from "next-auth/react"
import Header from '../../components/Header'

export default function SignIn({ providers }) {
  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center min-h-screen -mt-40">
      <img className='w-80' src="https://links.papareact.com/ocw" alt="instagram" />
      <div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className="px-5 py-2 mt-20 rounded-md hover:bg-blue-500 transition-all duration-200 ease-out bg-blue-400 text-white" onClick={
            () => signIn(provider.id, {callbackUrl: "/" })
            }
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
      </div>
    </div>
    </>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
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