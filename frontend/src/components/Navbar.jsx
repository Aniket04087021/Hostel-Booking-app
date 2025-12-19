import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <nav>
        <div className="logo">ANIII</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <Link
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                key={element.id}
              >
                {element.title}
              </Link>
            ))}
          </div>
          <div className="auth-buttons">
            {user ? (
              <>
                <span className="user-name">Hi, {user.firstName}</span>
                <button className="menuBtn" onClick={handleLogout}>
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <RouterLink to="/login" className="menuBtn" style={{ textDecoration: "none", display: "inline-block" }}>
                  LOGIN
                </RouterLink>
                <RouterLink to="/signup" className="menuBtn" style={{ textDecoration: "none", display: "inline-block", marginLeft: "10px" }}>
                  SIGNUP
                </RouterLink>
              </>
            )}
          </div>
        </div>
        <div className="hamburger" onClick={()=> setShow(!show)}>
                <GiHamburgerMenu/>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
