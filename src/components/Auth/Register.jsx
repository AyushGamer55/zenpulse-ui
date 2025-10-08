import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/api/auth/register", {
        email,
        password,
        displayName,
      });
      setSuccess("Registration successful! You can now log in.");
      setEmail("");
      setDisplayName("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="login register-bg">
      {/* Form */}
      <form className="login__form" onSubmit={handleSubmit}>
        {/* Title with logo video */}
        <h1 className="login__title">
          <video
            src="/videos/logo-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
            width="40"
            height="40"
            className="rounded-full shadow-lg object-cover"
          />
          Register
        </h1>

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600 text-center">{success}</div>
        )}

        <div className="login__content">
          {/* Email */}
          <div className="login__box">
            <i className="bx bx-envelope"></i>
            <div className="login__box-input">
              <input
                type="email"
                required
                className="login__input"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <label className="login__label">Email</label>
            </div>
          </div>

          {/* Display Name */}
          <div className="login__box">
            <i className="bx bx-user"></i>
            <div className="login__box-input">
              <input
                type="text"
                required
                className="login__input"
                placeholder=""
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
              <label className="login__label">Display Name</label>
            </div>
          </div>

          {/* Password */}
          <div className="login__box">
            <i className="ri-lock-2-line login__icon"></i>
            <div className="login__box-input">
              <input
                type={showPass ? "text" : "password"}
                required
                className="login__input"
                id="register-pass"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <label className="login__label">Password</label>
              <i
                className={`login__eye ${
                  showPass ? "ri-eye-line" : "ri-eye-off-line"
                }`}
                onClick={() => setShowPass(!showPass)}
              ></i>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="login__box">
            <i className="ri-lock-2-line login__icon"></i>
            <div className="login__box-input">
              <input
                type={showPass ? "text" : "password"}
                required
                className="login__input"
                id="register-confirm-pass"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <label className="login__label">Confirm Password</label>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="login__button">
          Register
        </button>

        {/* Login link */}
        <p className="login__register">
          Already have an account? <a href="/login">Sign in here</a>
        </p>
      </form>
    </div>
  );
}
