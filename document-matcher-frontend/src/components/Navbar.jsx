import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img 
          src="https://cdn.imgbin.com/22/3/15/imgbin-records-management-stock-photography-management-vzhKrVKUbe7ttfSm8AKuTfPnt.jpg" 
          alt="DocMatch Logo" 
          className="logo-img"
        />
        <span className="brand-name" style={{ color: 'white' }}><Link to="/">DocMatch</Link></span>
      </div>
      <div className="navbar-links">
        <Link to="/admin">Admin</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
