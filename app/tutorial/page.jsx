import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Tutorial from '@/components/Tutorial'

const tutorial = () => {
  return (
    <div className="dark:bg-neutral-800 bg-neutral-200" >

      <Header />
      <Tutorial />

      <Footer />
    </div>
  )
}

export default tutorial