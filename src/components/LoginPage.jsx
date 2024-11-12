import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0); // 0 = Sign In, 1 = Sign Up

  // Toggle visibility states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSignIn = async () => {
    if (email && password) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/signin",
          {
            email,
            password,
          }
        );

        const { Token, User } = response.data;
        localStorage.setItem("token", Token); // Save token for future use
        localStorage.setItem("user", JSON.stringify(User)); // Save user data
        onLogin(); // Update auth state
        navigate("/"); // Redirect to home page
      } catch (error) {
        console.error("Error during sign-in:", error);
        setError("Invalid login credentials");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleSignUp = async () => {
    if (email && password && userName && password === confirmPassword) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/signup",
          {
            email,
            password,
            userName,
          }
        );

        const { Token, User } = response.data;
        if (Token) {
          localStorage.setItem("token", Token); // Save token after signup
          localStorage.setItem("user", JSON.stringify(User)); // Save user data
          onLogin(); // Update auth state
          navigate("/"); // Redirect to home page
        } else {
          setError("Signup successful, but no token returned. Please log in.");
        }
      } catch (error) {
        console.error("Error during sign-up:", error);
        setError("Signup failed.");
      }
    } else {
      setError("Please fill in all fields correctly.");
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
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveIndex(e.index);
            setError(""); // Clear error on tab change
          }}
        >
          <TabPanel header="Sign In">
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
          </TabPanel>

          <TabPanel header="Sign Up">
            <div className="p-field">
              <label htmlFor="userName">Username</label>
              <InputText
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
                className="w-full"
              />
            </div>
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
            <div className="p-field relative">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <InputText
                id="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full"
              />
              <i
                className={`absolute right-3 top-9 pi ${
                  confirmPasswordVisible ? "pi-eye-slash" : "pi-eye"
                } cursor-pointer`}
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              />
            </div>
            <Button
              label="Sign Up"
              onClick={handleSignUp}
              className="w-full p-button mt-4"
            />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default LoginPage;
