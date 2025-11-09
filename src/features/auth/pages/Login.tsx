// src/pages/auth/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { login, clearError } from "../authSlice";
import notify from "devextreme/ui/notify";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!email || !password) {
      notify("Please fill all fields", "warning", 2000);
      return;
    }

    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      localStorage.setItem("token", resultAction.payload.token);
      localStorage.setItem("user", JSON.stringify(resultAction.payload.user));
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Task Management System</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
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

          <Button
            text={loading ? "Signing in..." : "Sign In"}
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

        <div className="login-footer">
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
