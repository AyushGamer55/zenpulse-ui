import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login">
      {/* Background */}
      <img
        src="/images/login-bg.jpg"
        alt="login background"
        className="login__img"
        style={{ filter: isDark ? "none" : "brightness(0.8)" }}
      />

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
          Login
        </h1>

        <div className="login__content">
          {/* Email */}
          <div className="login__box">
            <i className="bx bx-user"></i>
            <div className="login__box-input">
              <input
                type="email"
                required
                className="login__input"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="login__label">Email</label>
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
                id="login-pass"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        </div>

        {/* Error message */}
        {error && (
          <div
            className={`p-3 rounded-md border text-center font-semibold ${
              isDark ? "bg-red-900 border-red-700" : "bg-red-100 border-red-300"
            }`}
            style={{ color: isDark ? "#ef4444" : "#dc2626" }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Remember me + Forgot password */}
        <div className="login__check">
          <div className="login__check-group">
            <input type="checkbox" className="login__check-input" />
            <label className="login__check-label">Remember me</label>
          </div>
          <a href="#" className="login__forgot">
            Forgot password?
          </a>
        </div>

        {/* Submit button */}
        <button type="submit" className="login__button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register link */}
        <p className="login__register">
          Don’t have an account? <a href="/register">Sign up here</a>
        </p>
      </form>
    </div>
  );
}
