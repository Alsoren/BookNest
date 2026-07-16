import { DiVim } from "react-icons/di";
import React, { useState, useEffect, useRef } from "react";
import Navbar1 from "../components/Navbar1";
import ProfileHeader from "../components/ProfileHeader";
import ProfileContent from "../components/ProfileContent";
import "../Styles/ProfilePage.css";

function ProfilePage() {
  return(
    <div className="profile-main-page">
        <Navbar1 />
        <ProfileHeader />
        <ProfileContent />
    </div>
  );
}

export default ProfilePage;