import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar1 from "../components/Navbar1";
import ProfileHeader from "../components/ProfileHeader";
import ProfileContent from "../components/ProfileContent";

import "../Styles/ProfilePage.css";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Profil bilgileri alınamadı");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Profil getirme hatası:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  return (
    <div className="profile-main-page">
      <Navbar1 />

      {loading && (
        <div className="profile-page-message">
          Profil yükleniyor...
        </div>
      )}

      {error && (
        <div className="profile-page-message profile-page-error">
          {error}
        </div>
      )}

      {!loading && !error && profile && (
        <>
          <ProfileHeader profile={profile} />
          <ProfileContent />
        </>
      )}
    </div>
  );
}

export default ProfilePage;