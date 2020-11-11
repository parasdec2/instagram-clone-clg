import React, { useState } from "react";
import "./css/Header.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import TelegramIcon from "@material-ui/icons/Telegram";
import HomeIcon from "@material-ui/icons/Home";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import ExploreIcon from "@material-ui/icons/Explore";
import SearchIcon from "@material-ui/icons/Search";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Button, Avatar } from "@material-ui/core";
import { auth } from "../firebase";
import { useStateValue } from "../StateProvider";
import { Link, useHistory } from "react-router-dom";

// TODO: Add Bottom and Top navigation for small screens and normal menu for big screens

function Header() {
  const [{ user, userDetails }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);
  const history = useHistory();
  const handleLogout = () => {
    if (user) {
      auth.signOut().then(() => {
        history.push("/accounts/signin");
        window.location.reload();
      });
    }
  };

  {
    loading &&
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          if (!authUser.emailVerified) {
            // authUser.sendEmailVerification();
            setEmailVerified(false);
            history.push("/accounts/emailVerification");
          }
          setLoading(false);
        }
      });
  }

  const goToHomePage = () => {
    history.push("/");
  };

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__imageDiv">
          <img
            className="header__image"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="logo"
            onClick={goToHomePage}
          />
        </div>

        <div className="header__search">
          <div className="header__searchContainer">
            <SearchIcon style={{ width: "15px", height: "15px" }} />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="header__func">
          {emailVerified && (
            <Link to="/upload/post">
              {window.location.pathname === "/upload/post" ? (
                <AddCircleIcon
                  className="header__funcIcon"
                  style={{
                    fontSize: "30px",
                  }}
                />
              ) : (
                <AddCircleOutlineIcon
                  className="header__funcIcon"
                  style={{
                    fontSize: "30px",
                  }}
                />
              )}
            </Link>
          )}
          {emailVerified && (
            <Link to="/">
              {window.location.pathname === "/" ? (
                <HomeIcon
                  className="header__funcIcon"
                  style={{
                    fontSize: "30px",
                  }}
                />
              ) : (
                <HomeOutlinedIcon
                  className="header__funcIcon"
                  style={{
                    fontSize: "30px",
                  }}
                />
              )}
            </Link>
          )}
          {emailVerified && (
            <TelegramIcon
              className="header__funcIcon"
              style={{
                fontSize: "30px",
              }}
            />
          )}
          {emailVerified && (
            <Link to="/explore">
              {window.location.pathname === "/explore" ? (
                <ExploreIcon
                  className="header__funcIcon"
                  style={{
                    fontSize: "30px",
                  }}
                />
              ) : (
                <ExploreOutlinedIcon
                  className="header__funcIcon"
                  style={{
                    fontSize: "30px",
                  }}
                />
              )}
            </Link>
          )}
          {emailVerified && (
            <FavoriteBorderIcon
              className="header__funcIcon"
              style={{
                fontSize: "30px",
              }}
            />
          )}
          <Link
            to={`/${userDetails?.userName}`}
            className="header__funcIconAvatar"
          >
            <Avatar
              className="header__funcIcon"
              src={user?.photoUrl}
              style={{
                padding: "0px",
                width: "30px",
                height: "30px",
              }}
            />
          </Link>
        </div>
        {user && (
          <Button onClick={handleLogout} className="header__loginContainer">
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}

export default Header;
