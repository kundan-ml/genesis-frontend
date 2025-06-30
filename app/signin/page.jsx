import React from 'react'
import Signin from '@/components/Signin'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
const signin = () => {
  return (
    <section className=' relative bg-neutral-800 '>
      <Header />
      <Signin />
      <Footer />
    </section>
  )
}

export default signin