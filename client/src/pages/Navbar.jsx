import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className='body'>
      <div className='header'>
        <div className='logo'>
          <h3>Logo</h3>
        </div>
        <input type='checkbox' id='nav_check' hidden />
        <nav>
          <div className='logo'>
            <h3>Logo</h3>
          </div>
          <ul>
            <li>
              <Link to='/home'>Home</Link>
            </li>
            <li>
              <Link to='/about'>About Us</Link>
            </li>
            <li>
              <Link to='/login' className='active'>
                Login
              </Link>
            </li>
          </ul>
        </nav>
        <label htmlFor='nav_check' className='hamburger'>
          <div></div>
          <div></div>
          <div></div>
        </label>
      </div>
    </div>
  );
};

export default Navbar;
