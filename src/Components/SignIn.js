import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { db, auth } from "../firebase";

import "./css/SignIn.css";
function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleUserName = (e) => {
    e.preventDefault();
    var illegalChars = /\W+[.]+@/;
    if (illegalChars.test(e.target.value)) {
      alert(
        "Please enter valid Username. Use only numbers, alphabets and underscores"
      );
    } else {
      setUserName(e.target.value);
    }
  };

  const signIn = (e) => {
    e.preventDefault();
    if (userName.includes("@")) {
      auth
        .signInWithEmailAndPassword(userName, password)
        .then(() => {
          setUserName("");
          setPassword("");
          history.replace("/");
        })
        .catch((err) => alert(err.message));
    } else {
      db.collection("users")
        .where("userName", "==", userName)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const email = querySnapshot.docs[0].data().email;
            auth
              .signInWithEmailAndPassword(email, password)
              .then(() => {
                setUserName("");
                setPassword("");
                history.replace("/");
              })
              .catch((err) => alert(err.message));
          } else {
            alert("No User Exists with this username");
            setUserName("");
            setPassword("");
          }
        });
    }
  };
  return (
    <div className="signin">
      <div className="signin__container">
        <form className="signin__form">
          <center>
            <img
              className="signin__image"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="logo"
            />
          </center>
          <input
            className="signin__input"
            placeholder="Username or Email Address"
            type="text"
            value={userName}
            onChange={handleUserName}
          />
          <br />
          <input
            className="signin__input"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="signin__button" onClick={signIn}>
            Sign In
          </button>
        </form>
        <p className="forget__password">
          <a href="/accounts/passwors/reset" className="forget__password">
            Forget password ?
          </a>
        </p>

        <div className="signin__spaces">
          <div className="signin__space"></div>
          <p className="signin__or">OR</p>
          <div className="signin__space"></div>
        </div>
        {/* TODO: Login using facebook/ google */}
      </div>

      <div className="signin__signup">
        Don't have an account?
        <span className="signin__signupSpan">
          <Link className="signin__signupLink" to="/accounts/signup">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SignIn;
