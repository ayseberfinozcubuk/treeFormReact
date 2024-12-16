import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(
    parseInt(localStorage.getItem("failedAttempts")) || 0
  );
  const [timeoutRemaining, setTimeoutRemaining] = useState(
    parseInt(localStorage.getItem("timeoutRemaining")) || 0
  );
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 3;
  const TIMEOUT_DURATION = 10; // 10 seconds

  useEffect(() => {
    // Handle timeout countdown
    if (timeoutRemaining > 0) {
      setError(`Lütfen ${timeoutRemaining} saniye bekleyin ve tekrar deneyin.`);
      const timer = setInterval(() => {
        setTimeoutRemaining((prev) => {
          const updatedTimeout = prev - 1;
          localStorage.setItem("timeoutRemaining", updatedTimeout);
          setError(
            `Lütfen ${
              updatedTimeout > 0 ? updatedTimeout : 0
            } saniye bekleyin ve tekrar deneyin.`
          );
          return updatedTimeout;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      localStorage.removeItem("timeoutRemaining");
      setError(""); // Clear the error when timeout ends
    }
  }, [timeoutRemaining]);

  useEffect(() => {
    // Update failedAttempts in localStorage whenever it changes
    localStorage.setItem("failedAttempts", failedAttempts);
  }, [failedAttempts]);

  const handleSignIn = async () => {
    if (timeoutRemaining > 0) {
      return;
    }

    if (email && password) {
      try {
        const response = await axiosInstance.post("/api/users/signin", {
          email,
          password,
        });
        const { User } = response.data;

        // Authentication successful
        onLogin(); // Set isAuthenticated to true in App.jsx
        localStorage.setItem("user", JSON.stringify(User)); // Optional: Store user info (non-sensitive)

        // Reset failed attempts and timeout on successful login
        localStorage.removeItem("failedAttempts");
        localStorage.removeItem("timeoutRemaining");
        setFailedAttempts(0);
        setTimeoutRemaining(0);

        navigate("/");
      } catch (error) {
        const updatedAttempts = failedAttempts + 1;

        if (updatedAttempts >= MAX_ATTEMPTS) {
          setTimeoutRemaining(TIMEOUT_DURATION);
          setFailedAttempts(0);
          localStorage.setItem("timeoutRemaining", TIMEOUT_DURATION);
          setError(
            `Çok fazla başarısız giriş denemesi. Lütfen ${TIMEOUT_DURATION} saniye bekleyin.`
          );
        } else {
          setFailedAttempts(updatedAttempts);
          setError(
            `Geçersiz giriş bilgileri. ${
              MAX_ATTEMPTS - updatedAttempts
            } deneme hakkınız kaldı.`
          );
        }
      }
    } else {
      setError("Lütfen tüm alanları doldurun.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">EHBB</h2>
        {error && (
          <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}
        <div className="p-field">
          <label htmlFor="email" className="block py-2 text-lg leading-none">
            E-posta
          </label>{" "}
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresinizi girin"
            className="w-full pr-10 py-2 text-lg"
          />
        </div>
        <div className="p-field relative">
          <label htmlFor="password" className="block py-2 text-lg leading-none">
            Şifre
          </label>{" "}
          <div className="relative">
            <InputText
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              className="w-full pr-10 py-2 text-lg"
            />
            <i
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 pi ${
                passwordVisible ? "pi-eye-slash" : "pi-eye"
              } cursor-pointer`}
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </div>
        </div>

        <Button
          label="Giriş Yap"
          onClick={handleSignIn}
          disabled={timeoutRemaining > 0} // Disable button if timeout is active
          className={`w-full p-button ${
            timeoutRemaining > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-400"
          } text-white mt-4`}
          style={{ fontSize: "1rem", padding: "0.75rem" }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
