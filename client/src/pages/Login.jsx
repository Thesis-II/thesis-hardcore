import { Link } from "react-router-dom";
import { useState } from "react";
import "../CSS/style.css";
import Axios from "axios";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    Axios.post("http://localhost:3001/api/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data === "Login successful") {
          alert("Login successful!");
          // Redirect or perform other actions after successful login
        } else {
          alert("Login Failed.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='make-it-drop'>
      <div className='main-wrapper'>
        <div className='wrapper'>
          <form>
            <h1>Login</h1>
            <div className='input-box'>
              <input
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <i className='bx bxs-user'></i>
            </div>
            <div className='input-box'>
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className='bx bxs-lock-alt'></i>
            </div>

            <button type='button' onClick={login} className='btn'>
              Login
            </button>

            <div className='register-link'>
              <p>
                Dont have an account? <Link to='/register'>Register</Link>
              </p>
            </div>
            <div className='register-link'>
              <p>
                <Link to='/home'>Back to home</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
