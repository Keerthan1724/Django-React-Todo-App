import { useState, useRef } from "react";
import "./Authentication.css";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import google_color from "../../assets/google_color.svg";
import api from "../../utils/api";

const Authentication = () => {
  const navigate = useNavigate();

  const [signState, setSignState] = useState("Sign In");
  const [authStep, setAuthStep] = useState("form");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [buttonState, setButtonState] = useState("send");
  const [timer, setTimer] = useState(0);

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      alert("Login success");
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/create");
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      alert("Invalid email or password");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/signup/", {
        username,
        email,
        password,
      });

      alert("Account created. Now sign in");
      setSignState("Sign In");
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
      alert("Signup failed");
    }
  };

  const handleForgot = async () => {
    setAuthStep("otp");
    setButtonState("send");
  };

  const handleSendOrResendOtp = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/send-otp/", { email });
      alert("OTP sent");

      setAuthStep("otp");
      setButtonState("resend");
    } catch (error) {
      alert("Email not found");
    }

    setTimer(59);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) otpRefs[index + 1].current.focus();
    if (!value && index > 0) otpRefs[index - 1].current.focus();

    if (newOtp.every((x) => x !== "")) {
      setButtonState("verify");
    } else {
      if (buttonState !== "send") setButtonState("resend");
    }
  };

  const handleOtpButtonClick = async () => {
    if (buttonState === "send" || buttonState === "resend") {
      handleSendOrResendOtp();
      return;
    }

    if (buttonState === "verify") {
      const otpCode = otp.join("");
      if (otpCode.length < 4) {
        alert("Please enter complete OTP");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/api/verify-otp/",
          {
            email,
            otp: otpCode,
          }
        );

        if (response.data.message === "OTP verified") {
          alert("OTP verified. You can reset password now.");
          setAuthStep("reset");
        } else {
          alert("Invalid OTP");
        }
      } catch (error) {
        console.log("Error:", error.response?.data);
        alert("Error verifying OTP");
      }
    }
  };

  const handleReset = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/reset-password/", {
        email,
        otp: otp.join(""),
        new_password: password,
      });

      alert("Password reset successful");
      setAuthStep("form");
      setSignState("Sign In");
    } catch (error) {
      alert("Invalid OTP or error");
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    redirect_uri: "http://localhost:5173",
    onSuccess: async (tokenResponse) => {
      try {
        console.log("TOKEN RESPONSE:", tokenResponse);
        const response = await axios.post(
          "http://localhost:8000/api/google-login/",
          { token: tokenResponse.access_token }
        );

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        alert("Google Login Successful");

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        navigate("/create");
      } catch (error) {
        alert("Backend Google login failed");
      }
    },
    onError: () => alert("Google Login Failed"),
  });

  return (
    <div className="auth-page">
      <h1 className="auth-logo">📝 TODO APP</h1>

      <div className="auth-form">
        {authStep === "form" && (
          <>
            <h1>{signState}</h1>
            <div className="inputs-container">
              {signState === "Sign Up" && (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {signState === "Sign In" && (
                <p className="forgot-pass" onClick={handleForgot}>
                  Forgot Password?
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  if (signState === "Sign In")
                    handleSignIn({ preventDefault: () => {} });
                  else handleSignUp({ preventDefault: () => {} });
                }}
              >
                {signState}
              </button>

              {signState === "Sign In" && (
                <div className="divider">
                  <span>OR</span>
                </div>
              )}
              {signState === "Sign In" && (
                <div className="google-btn" onClick={googleLogin}>
                  <img src={google_color} alt="G" />
                  <span>Sign in with Google</span>
                </div>
              )}
            </div>

            <div className="form-switch">
              {signState === "Sign In" ? (
                <>
                  New user?{" "}
                  <span onClick={() => setSignState("Sign Up")}>
                    Sign Up Now
                  </span>
                </>
              ) : (
                <>
                  Already have account?{" "}
                  <span onClick={() => setSignState("Sign In")}>
                    Sign In Now
                  </span>
                </>
              )}
            </div>
          </>
        )}

        {authStep === "otp" && (
          <>
            <h1>Forgot Password</h1>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="otp-box">
              {otp.map((v, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength="1"
                  ref={otpRefs[i]}
                  value={v}
                  onChange={(e) => handleOtpChange(e, i)}
                />
              ))}
            </div>

            {timer > 0 && <p>{timer}s</p>}

            <button type="button" onClick={handleOtpButtonClick}>
              {buttonState === "send"
                ? "Send OTP"
                : buttonState === "resend"
                ? "Resend OTP"
                : "Verify OTP"}
            </button>

            <p onClick={() => setAuthStep("form")} className="back-link">
              Back
            </p>
          </>
        )}

        {authStep === "reset" && (
          <>
            <h1>Reset Password</h1>
            <div>
              <input type="email" value={email} readOnly />

              <input
                type="password"
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button type="button" onClick={handleReset}>
                Reset Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Authentication;
