'use client';
import { useState, useEffect } from 'react';
import { lightTheme, darkTheme, GlobalStyles } from '@/themes/Theme';
import Head from 'next/head';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CTASECTION from '@/components/CTASECTION';
import Footer from '@/components/Footer';
import FAQS from '@/components/FAQS';


export default function Home({ Component, pageProps }) {
  
  const [theme, setTheme] = useState('light');

  // useEffect(() => {
  //   if ('serviceWorker' in navigator && 'PushManager' in window) {
  //     navigator.serviceWorker.register('/sw.js')
  //       .then(function(registration) {
  //         // console.log('Service Worker registered with scope:', registration.scope);
  //       })
  //       .catch(function(error) {
  //         // console.log('Service Worker registration failed:', error);
  //       });
  //   }
  // }, []);

  // const requestNotificationPermission = async () => {
  //   if (!('Notification' in window)) {
  //     // console.log('This browser does not support notifications.');
  //     return;
  //   }
  
  //   const permission = await Notification.requestPermission();
  //   if (permission === 'granted') {
  //     // console.log('Notification permission granted.');
  //   } else {
  //     // console.log('Notification permission denied.');
  //   }
  // };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <Head>
        <title>GENIE GENESIS - Leading Text-to-Image Generation with Generative AI</title>
        <meta name="description" content="Discover GENIE GENESIS , the leading platform for text-to-image generation powered by advanced generative AI technology. Explore our features, pricing, and more." />
        <meta property="og:title" content="GENIE GENESIS - Leading Text-to-Image Generation with Generative AI" />
        <meta property="og:description" content="Discover GENIE GENESIS, the leading platform for text-to-image generation powered by advanced generative AI technology. Explore our features, pricing, and more." />
        <meta property="og:image" content="images/images1.png" />
        <meta property="og:url" content="https://geniegenesis.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GENIE GENESIS - Leading Text-to-Image Generation with Generative AI" />
        <meta name="twitter:description" content="Discover GENIE GENESIS , the leading platform for text-to-image generation powered by advanced generative AI technology. Explore our features, pricing, and more." />
        <meta name="twitter:image" content="/path/to/your/image.jpg" />
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "GENIE GENESIS ",
            "url": "https://geniegenesis.vercel.app/",
            "description": "Explore GENIE GENESIS , an advanced text-to-image generation platform leveraging generative AI technology."
          }),
        }}
      />
      </Head>
              {/* <GlobalStyles /> */}
        <Header />
        <HeroSection />
        {/* <FeatureSection /> */}
        {/* <Feature_t /> */}
        {/* <Pricing /> */}
        {/* <Testemonials />  */}
        {/* <ContactSection /> */}
        {/* <Stats />  */}
        <CTASECTION />
        {/* <FAQS /> */}
        {/* <Newsletter />  */}
        {/* <LogoGrid />  */}
        <Footer />

    </>
  );
}
