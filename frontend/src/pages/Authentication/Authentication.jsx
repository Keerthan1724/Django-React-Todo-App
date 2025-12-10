import { useState, useRef, useEffect } from "react";
import "./Authentication.css";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import google_color from "../../assets/google_color.svg";
import eye_open from "../../assets/eye_open.svg";
import eye_closed from "../../assets/eye_closed.svg";
import email_icon from "../../assets/email_icon.svg";
import user_icon from "../../assets/user_icon.svg";
import { notify } from "../../utils/toastHelper";

const Authentication = () => {
  const navigate = useNavigate();

  const [signState, setSignState] = useState("Sign In");
  const [authStep, setAuthStep] = useState("form");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [buttonState, setButtonState] = useState("send");
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const APIUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (timer === 0) {
      setButtonState("resend");
    }
  }, [timer]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${APIUrl}/api/login/`, {
        username,
        password,
      });

      notify("Login Successful", "success");
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/create");
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      notify("Invalid email or password", "error");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${APIUrl}/api/signup/`, {
        username,
        email,
        password,
      });

      notify("Account created. Now sign in", "success");
      setSignState("Sign In");
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
      notify("Signup failed", "error");
    }
  };

  const handleForgot = async () => {
    setAuthStep("otp");
    setButtonState("send");
  };

  const handleSendOrResendOtp = async () => {
    if (!email) {
      notify("Enter email", "info");
      return;
    }

    if (buttonState === "resend" && timer > 0) {
      notify(`Please wait ${timer}s before resending OTP`, "info");
      return;
    }

    try {
      await axios.post(`${APIUrl}/api/send-otp/`, { email });
      notify("OTP sent to Your email", "success");

      setAuthStep("otp");
      setButtonState("resend");

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
    } catch (error) {
      console.log("Error sending OTP:", error.response?.data);
      notify("Failed to send OTP", "error");
    }
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
      if (timer === 0) {
        setButtonState("resend");
      }
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
        notify("Please enter complete OTP", "info");
        return;
      }

      try {
        const response = await axios.post(
          `${APIUrl}/api/verify-otp/`,
          {
            email,
            otp: otpCode,
          }
        );

        if (response.data.message === "OTP verified") {
          notify("OTP verified. You can reset password now.", "success");
          setAuthStep("reset");
        } else {
          notify("Invalid OTP", "error");
        }
      } catch (error) {
        const msg = error.response?.data?.error || "Verification failed";
        console.log("OTP VERIFY ERROR =>", msg);

        alert(msg);

        if (msg.toLowerCase().includes("expired")) {
          setButtonState("resend");
          setTimer(0);
          setOtp(["", "", "", ""]);
        }
      }
    }
  };

  const handleReset = async () => {
    if (password !== confirmPassword) {
      notify("Passwords do not match", "error");
      return;
    }

    try {
      await axios.post(`${APIUrl}/api/reset-password/`, {
        email,
        otp: otp.join(""),
        new_password: password,
      });

      notify("Password reset successful", "success");
      setAuthStep("form");
      setSignState("Sign In");
      setOtp(["", "", "", ""]);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log("Reset error:", error.response?.data);
      notify("Invalid OTP or error", "error");
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    redirect_uri: "http://localhost:5173",
    onSuccess: async (tokenResponse) => {
      try {
        console.log("TOKEN RESPONSE:", tokenResponse);
        const response = await axios.post(
          `${APIUrl}/api/google-login/`,
          { token: tokenResponse.access_token }
        );

        notify("Google Login Successful", "success");

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        navigate("/create");
      } catch (error) {
        notify("Backend Google login failed", "error");
      }
    },
    onError: () => notify("Google Login Failed", "error"),
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
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <img src={email_icon} alt="" />
                </div>
              )}

              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <img src={user_icon} alt="" />
              </div>

              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={showPassword ? eye_open : eye_closed}
                  alt="toggle visibility"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

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

            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img src={email_icon} alt="" />
            </div>

            <div className="otp-box">
              {otp.map((v, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  ref={otpRefs[i]}
                  value={v}
                  onChange={(e) => handleOtpChange(e, i)}
                />
              ))}
            </div>

            {timer > 0 && (
              <p>
                {Math.floor(timer / 60)} : {String(timer % 60).padStart(2, "0")}{" "}
                s
              </p>
            )}

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
              <div className="input-wrapper">
                <input type="email" value={email} readOnly />
                <img src={email_icon} alt="" />
              </div>

              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={showPassword ? eye_open : eye_closed}
                  alt="toggle visibility"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              <input
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={handleReset}
                disabled={
                  otp.join("").length < 4 || !password || !confirmPassword
                }
              >
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
