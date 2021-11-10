import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import Feed from '../components/Feed'
import Header from '../components/Header'
import Modal from '../components/Modal'

export default function Home() {

  const openModal = useRecoilValue(modalState);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Instagram-clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {openModal && (
        <Modal/>
      )}
      <Header />
      <Feed />


    </div>
  )
};

