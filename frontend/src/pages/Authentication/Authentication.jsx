import { useState, useRef } from "react";
import "./Authentication.css";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import google_color from "../../assets/google_color.svg";

const Authentication = () => {
  const [signState, setSignState] = useState("Sign In");
  const [authStep, setAuthStep] = useState("form");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });

      alert("Login success");
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
    } catch (error) {
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
    } catch (error) {
      alert("Signup failed");
    }
  };

  const handleForgot = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/send-otp/", { email });
      setAuthStep("otp");
      alert("OTP sent");
    } catch (error) {
      alert("Email not found");
    }
  };

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpSubmit = () => {
    setAuthStep("reset");
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
    redirect_uri: "http://localhost:3000",
    onSuccess: async (tokenResponse) => {
      try {
        console.log("TOKEN RESPONSE:", tokenResponse)
        const response = await axios.post(
          "http://localhost:8000/api/google-login/",
          { token: tokenResponse.access_token }
        );

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        alert("Google Login Successful");
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
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

              {signState === "Sign In" &&
              (<div className="divider">
                <span>OR</span>
              </div>)}
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
            <h1>Enter OTP</h1>
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

            <button type="button" onClick={handleOtpSubmit}>
              Verify OTP
            </button>
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
