'use client'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

const contact = () => {

  return (
    <div className="dark:bg-neutral-800 bg-neutral-200" >
      <Header />
      <Contact />
      <Footer />
    </div>
  )
}

export default contact