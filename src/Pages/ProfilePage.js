import { DiVim } from "react-icons/di";
import React, { useState, useEffect, useRef } from "react";
import Navbar1 from "../components/Navbar1";
import ProfileHeader from "../components/ProfileHeader";
import "../Styles/ProfilePage.css";

function HomePage() {
  return(
    <div className="profile-main-page">
        <Navbar1 />
        <ProfileHeader />

    </div>
  );
}

export default HomePage;