import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import firebase from "firebase";
import "./css/SignUp.css";
function SignUp() {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(true);
  const [userNameExists, setUserNameExists] = useState(true);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleUsername = (e) => {
    e.preventDefault();
    var illegalChars = /\W/;
    if (illegalChars.test(e.target.value)) {
      alert(
        "Please enter valid Username. Use only numbers, alphabets and underscores"
      );
    } else {
      setUserName(e.target.value);
    }
  };

  const signUp = (e) => {
    e.preventDefault();
    if (email !== "") {
      if (password !== "") {
        if (fullName !== "") {
          db.collection("users")
            .where("email", "==", email)
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.empty) {
                auth
                  .createUserWithEmailAndPassword(email, password)
                  .then((authUer) => {
                    const update = {
                      displayName: fullName,
                    };
                    authUer.user.updateProfile(update);
                    history.push("/accounts/emailVerification");
                  })
                  .catch((err) => alert(err.message));
              } else {
                alert("Email already exists");
              }
            })
            .catch((err) => console.log(err));
        } else {
          alert("Please enter your name");
        }
      } else {
        alert("Please enter a Password");
      }
    } else {
      alert("Please enter an Email Address");
    }
  };
  return (
    <div className="signin">
      <div className="signin__container">
        <img
          className="signin__image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
        <p className="signin__text">
          Sign up to see photos and videos from your friends.
        </p>
        {/* TODO: Login using facebook/ google */}

        <div className="signin__spaces">
          <div className="signin__space"></div>
          <p className="signin__or">OR</p>
          <div className="signin__space"></div>
        </div>
        <form className="signin__form">
          <input
            className="signin__input"
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input
            className="signin__input"
            placeholder="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <br />
          {/* <input
            className="signin__input"
            placeholder="username"
            type="text"
            value={userName}
            onChange={handleUsername}
            required
          />
          <br /> */}
          <input
            className="signin__input"
            placeholder="password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {/* {email !== "" &&
            // userName !== "" &&
            password !== "" &&
            fullName !== "" &&
             (
              <button className="signin__button" onClick={signUp}>
                Sign Up
              </button>
              )}
              {email === "" ||
              // userName === "" ||
              password === "" ||
              (fullName === "" && (
                <button className="signin__button" onClick={signUp} disabled>
                Sign Up
                </button>
              ))} */}
          <button className="signin__button" onClick={signUp}>
            Sign Up
          </button>
          <p>
            By signing up, you agree to our Terms , Data Policy and Cookies
            Policy .
          </p>
        </form>
      </div>

      <div className="signin__signup">
        Already have an account?
        <span className="signin__signupSpan">
          <Link className="signin__signupLink" to="/accounts/signin">
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SignUp;
