import { DiVim } from "react-icons/di";
import React, { useState, useEffect, useRef } from "react";
import Navbar1 from "../components/Navbar1";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import "../Styles/HomePage.css";
import FeaturedBooks from "../components/FeaturedBooks"
import WhyUs from "../components/WhyUs";
import Footer from "../components/Footer";
import BooksPage from "./BooksPage";

function HomePage() {
  return(
    <div className="home-main-page">
      <div className="home-content">
        <><Navbar1 />
          <HeroSection />
          <FeaturedBooks />
          <CategoriesSection />
          <WhyUs />
          <Footer />
        </>
      </div>
    </div>
  );
}

export default HomePage;