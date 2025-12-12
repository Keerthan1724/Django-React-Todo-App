import React, { useEffect, useState } from "react";
import "./Account.css";
import Navbar from "../../components/Navbar/Navbar";
import api from "../../utils/api";
import defaultAvatar from "../../assets/noprofile.jpg";
import add_icon from "../../assets/add_icon.svg";

const Account = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profileImage: "",
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
  });

  const [profileImage, setProfileImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const APIUrl = import.meta.env.VITE_API_URL;

  const handelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const response = await api.post("user/profile/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fullURL = APIUrl + response.data.profile_image;
      setProfileImage(fullURL);
    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("user/profile");
        const data = response.data;

        setUserData({
          username: data.username,
          email: data.email,
          profileImage: data.profile_image || "",
          totalTodos: data.total_todos,
          completedTodos: data.completed_todos,
          pendingTodos: data.pending_todos,
        });

        setProfileImage(
          data.profile_image ? APIUrl + data.profile_image : ""
        );
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="account-page">
      <Navbar />

      <div className="account-container">
        <h1>ACCOUNT INFO</h1>

        <div className="acc-center-box">
          <div className="profile-pic-wrapper">
            <img
              src={profileImage || defaultAvatar}
              alt="profile"
              className="profile-pic"

              // NEW: open preview modal
              onClick={() => setShowPreview(true)}
              style={{ cursor: "pointer" }}
            />

            <label className="upload-btn">
              <img src={add_icon} alt="" />
              <input
                type="file"
                accept="image/*"
                onChange={handelUpload}
                hidden
              />
            </label>
          </div>

          <div className="user-info-box">
            <p>
              <strong>Username :</strong>
              {userData.username}
            </p>
            <p>
              <strong>Email :</strong>
              {userData.email}
            </p>
          </div>

          <div className="user-stats">
            <div className="stat-card">
              <p>
                <strong>Total Todos</strong> {userData.totalTodos}
              </p>
              <p>
                <strong>Completed</strong> {userData.completedTodos}
              </p>
              <p>
                <strong>Pending</strong> {userData.pendingTodos}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div
            className="preview-box"
            onClick={(e) => e.stopPropagation()} // prevent accidental close
          >
            <img
              src={profileImage || defaultAvatar}
              alt="preview"
            />
            <button className="close-btn" onClick={() => setShowPreview(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Account;
