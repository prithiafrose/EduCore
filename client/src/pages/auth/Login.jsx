import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser(email, password);

    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    if (data.data.user.role === "ADMIN") {
  navigate("/admin");
} else if (data.data.user.role === "TEACHER") {
  navigate("/teacher");
} else if (data.data.user.role === "STUDENT") {
  navigate("/student");
}

    console.log("Login successful");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;