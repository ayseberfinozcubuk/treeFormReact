// UserProfile.jsx
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

const UserProfile = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const handleLogin = () => {
    // Add your login logic here
    console.log("Logging in with:", { email, password, userName });
    setVisible(false);
  };

  const footer = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setVisible(false)}
      />
      <Button
        label="Login"
        icon="pi pi-check"
        className="p-button"
        onClick={handleLogin}
      />
    </div>
  );

  return (
    <div className="flex items-center">
      <Button
        icon="pi pi-user"
        className="p-button-text text-white"
        onClick={() => setVisible(true)}
        aria-label="User Profile"
      />
      <Dialog
        header="User Login"
        visible={visible}
        style={{ width: "30vw" }}
        footer={footer}
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid space-y-4">
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
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
