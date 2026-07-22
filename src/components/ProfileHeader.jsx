import { useEffect, useState } from "react";

import "../Styles/ProfileHeader.css";

import heroImage1 from "../assets/hero-section.png";
import heroImage2 from "../assets/hero-section2.png";
import messageIcon from "../assets/message-icon.png";
import saveIcon from "../assets/save-icon.png";
import bookIcon from "../assets/book-icon.png";
import bookMonster from "../assets/book_monster.png";

const API_BASE_URL = "http://localhost:8080";

function ProfileHeader({ profile }) {
  const [finishedBookCount, setFinishedBookCount] =
    useState(0);

  const [readingListCount, setReadingListCount] =
    useState(0);

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [statsError, setStatsError] =
    useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookStats() {
      const token = localStorage.getItem("token");

      if (!token) {
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);
        setStatsError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          finishedResponse,
          readingResponse,
          wantToReadResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/user-books/me/status/READ`,
            {
              method: "GET",
              headers,
              signal: controller.signal,
            }
          ),

          fetch(
            `${API_BASE_URL}/api/user-books/me/status/READING`,
            {
              method: "GET",
              headers,
              signal: controller.signal,
            }
          ),

          fetch(
            `${API_BASE_URL}/api/user-books/me/status/WANT_TO_READ`,
            {
              method: "GET",
              headers,
              signal: controller.signal,
            }
          ),
        ]);

        if (
          !finishedResponse.ok ||
          !readingResponse.ok ||
          !wantToReadResponse.ok
        ) {
          throw new Error(
            "Kitap istatistikleri alınamadı."
          );
        }

        const [
          finishedBooks,
          readingBooks,
          wantToReadBooks,
        ] = await Promise.all([
          finishedResponse.json(),
          readingResponse.json(),
          wantToReadResponse.json(),
        ]);

        setFinishedBookCount(
          Array.isArray(finishedBooks)
            ? finishedBooks.length
            : 0
        );

        const readingCount =
          Array.isArray(readingBooks)
            ? readingBooks.length
            : 0;

        const wantToReadCount =
          Array.isArray(wantToReadBooks)
            ? wantToReadBooks.length
            : 0;

        setReadingListCount(
          readingCount + wantToReadCount
        );
      } catch (requestError) {
        if (requestError.name === "AbortError") {
          return;
        }

        console.error(
          "Profil kitap istatistikleri alınamadı:",
          requestError
        );

        setStatsError(
          "Kitap istatistikleri yüklenemedi."
        );
      } finally {
        if (!controller.signal.aborted) {
          setStatsLoading(false);
        }
      }
    }

    loadBookStats();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="profile-wrapper">
      <section className="profile-section">
        <div className="profile-hero-image left-prohero-image">
          <img
            src={heroImage1}
            alt="Kitap okuyan kişi"
          />
        </div>

        <div className="profile-content">
          <div>
            <div className="profile-avatar">
              <img
                src={bookMonster}
                alt="Profil görseli"
              />
            </div>
          </div>

          <div className="profile-infos">
            <h1>{profile.name}</h1>

            <p>{profile.email}</p>

            <p>
              Güncellemeler:{" "}
              {profile.agreeToUpdates
                ? "Açık"
                : "Kapalı"}
            </p>

            <div className="profile-stats">
              <div className="stat readed-book">
                <img src={bookIcon} alt="" />

                <div>
                  <p className="stat-number">
                    {statsLoading
                      ? "..."
                      : finishedBookCount}
                  </p>

                  <p className="stat-title">
                    Okunan Kitap
                  </p>
                </div>
              </div>

              <div className="stat my-lists">
                <img src={saveIcon} alt="" />

                <div>
                  <p className="stat-number">
                    {statsLoading
                      ? "..."
                      : readingListCount}
                  </p>

                  <p className="stat-title">
                    Okuma Listem
                  </p>
                </div>
              </div>

              <div className="stat num-comment">
                <img src={messageIcon} alt="" />

                <div>
                  <p className="stat-number">
                    82
                  </p>

                  <p className="stat-title">
                    Yorumlar
                  </p>
                </div>
              </div>
            </div>

            {statsError && (
              <p className="profile-stats-error">
                {statsError}
              </p>
            )}
          </div>
        </div>

        <div className="hero-image right-prohero-image">
          <img
            src={heroImage2}
            alt="Kitap okuyan kişi"
          />
        </div>
      </section>
    </div>
  );
}

export default ProfileHeader;