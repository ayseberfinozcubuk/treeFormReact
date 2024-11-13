import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = async () => {
    if (email && password) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/signin",
          { email, password }
        );
        const { Token, User } = response.data;
        localStorage.setItem("token", Token);
        localStorage.setItem("user", JSON.stringify(User));
        onLogin();
        navigate("/");
      } catch (error) {
        console.error("Error during sign-in:", error);
        setError("Invalid login credentials");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Employee Portal</h2>
        {error && (
          <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}
        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full"
          />
        </div>
        <div className="p-field relative">
          <label htmlFor="password">Password</label>
          <InputText
            id="password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full"
          />
          <i
            className={`absolute right-3 top-9 pi ${
              passwordVisible ? "pi-eye-slash" : "pi-eye"
            } cursor-pointer`}
            onClick={() => setPasswordVisible(!passwordVisible)}
          />
        </div>
        <Button
          label="Sign In"
          onClick={handleSignIn}
          className="w-full p-button mt-4"
        />
      </div>
    </div>
  );
};

export default LoginPage;
