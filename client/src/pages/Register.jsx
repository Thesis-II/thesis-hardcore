import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";

const Register = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    Axios.post("http://localhost:3001/api/insert", {
      username: username,
      password: password,
    })
      .then((response) => {
        console.log(response.data);
        if (response.data === "Data inserted successfully") {
          alert("Registration successful!");
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
            <h1>Register</h1>
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

            <button type='button' onClick={register} className='btn'>
              Register
            </button>

            <div className='register-link'>
              <p>
                Already have an account? <Link to='/login'>Login</Link>
              </p>
            </div>
            <div className='register-link'>
              <p>
                <Link to='/login'>Back</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
