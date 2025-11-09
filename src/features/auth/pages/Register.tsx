// src/pages/auth/Register.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { SelectBox } from "devextreme-react/select-box";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { register, clearError } from "../authSlice";
import notify from "devextreme/ui/notify";
import "./register.css";

const roleOptions = [
  { value: 1, text: "Admin" },
  { value: 2, text: "Team Leader" },
  { value: 3, text: "Member" },
];

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(3); // Default to Member (3)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      notify(error, "error", 3000);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      notify("Please enter a valid email address", "warning", 2000);
      return false;
    }
    if (!fullName.trim()) {
      notify("Please enter your full name", "warning", 2000);
      return false;
    }
    if (!password || password.length < 6) {
      notify("Password must be at least 6 characters long", "warning", 2000);
      return false;
    }
    if (password !== confirmPassword) {
      notify("Passwords do not match", "warning", 2000);
      return false;
    }
    if (![1, 2, 3].includes(role)) {
      notify("Please select a valid role", "warning", 2000);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const resultAction = await dispatch(
      register({ email, password, fullName, role })
    );

    if (register.fulfilled.match(resultAction)) {
      localStorage.setItem("token", resultAction.payload.token);
      localStorage.setItem("user", JSON.stringify(resultAction.payload.user));
      notify("Account created successfully!", "success", 2000);
      navigate("/dashboard");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Task Management System</h1>
        <p className="register-subtitle">Create a new account</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <TextBox
              value={fullName}
              onValueChanged={(e) => setFullName(e.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <TextBox
              value={email}
              onValueChanged={(e) => setEmail(e.value)}
              placeholder="Enter your email"
              mode="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <TextBox
              value={password}
              onValueChanged={(e) => setPassword(e.value)}
              placeholder="Enter your password"
              mode="password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <TextBox
              value={confirmPassword}
              onValueChanged={(e) => setConfirmPassword(e.value)}
              placeholder="Confirm your password"
              mode="password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <SelectBox
              items={roleOptions}
              valueExpr="value"
              displayExpr="text"
              value={role}
              onValueChanged={(e) => setRole(e.value)}
              disabled={loading}
              placeholder="Select your role"
            />
          </div>

          <Button
            text={loading ? "Creating account..." : "Register"}
            type="default"
            useSubmitBehavior={true}
            disabled={loading}
            width="100%"
            height={45}
          />

          {loading && (
            <div className="loading-indicator">
              <LoadIndicator visible={true} />
            </div>
          )}
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;