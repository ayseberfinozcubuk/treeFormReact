// components/LoginPage.jsx
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0); // 0 = Sign In, 1 = Sign Up

  const handleSignIn = () => {
    if (email && password) {
      // Authentication logic here (mock or actual API call)
      onLogin();
      navigate("/"); // Redirect to home after login
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleSignUp = () => {
    if (email && password && userName && password === confirmPassword) {
      // Sign-up logic here (mock or actual API call)
      onLogin();
      navigate("/"); // Redirect to home after sign-up
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
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* Sign-In Tab */}
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
            <div className="p-field">
              <label htmlFor="password">Password</label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                feedback={false}
                toggleMask
                className="w-full"
              />
            </div>
            <Button
              label="Sign In"
              onClick={handleSignIn}
              className="w-full p-button mt-4"
            />
          </TabPanel>

          {/* Sign-Up Tab */}
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
            <div className="p-field">
              <label htmlFor="password">Password</label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                feedback={false}
                toggleMask
                className="w-full"
              />
            </div>
            <div className="p-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                feedback={false}
                toggleMask
                className="w-full"
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
