import React from 'react';
import Hero from '../components/Hero';
import TopTicker from '../components/TopTicker';
import Categories from '../components/Categories';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Sellers from '../components/Sellers';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <main>
      <Hero />
      <TopTicker />
      <Categories />
      <HowItWorks />
      <Features />
      <Sellers />
      <Testimonials />
    </main>
  );
};

export default Home;