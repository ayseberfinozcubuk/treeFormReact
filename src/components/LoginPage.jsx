import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = async () => {
    // console.log("sign-in");
    // console.log("email: ", email, " password: ", password);
    if (email && password) {
      try {
        // console.log("inside try-catch");
        const response = await axiosInstance.post("/api/users/signin", {
          email,
          password,
        });
        const { User } = response.data;
        // console.log("user: ", User);

        // Authentication successful
        onLogin(); // Set isAuthenticated to true in App.jsx
        localStorage.setItem("user", JSON.stringify(User)); // Optional: Store user info (non-sensitive)

        navigate("/");
      } catch (error) {
        // console.error("Error during sign-in:", error);
        setError("Geçersiz giriş bilgileri");
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
            className="w-full pr-10 py-2 text-lg" // Added padding-y for height and text size for better visibility
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
              className="w-full pr-10 py-2 text-lg" // Added padding-y for height and text size for better visibility
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
          className="w-full p-button bg-blue-500 hover:bg-blue-400 text-white mt-4"
          style={{ fontSize: "1rem", padding: "0.75rem" }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
