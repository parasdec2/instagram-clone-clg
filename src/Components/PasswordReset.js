import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import "./css/PasswordReset.css";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const handleEmail = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const SendResetLink = (e) => {
    e.preventDefault();
    auth
      .fetchSignInMethodsForEmail(email)
      .then((data) => {
        if (data.length === 0) {
          alert("No user with this email Id");
        } else {
          const result = data.find((method) => method === "password");
          if (result === "password") {
            auth.sendPasswordResetEmail(email).then(() => {
              alert("Email Send");
            });
          }
        }
      })
      .catch((err) => alert(err.error));
    // console.log(abc);
  };
  return (
    <div className="passwordReset">
      <div className="passwordReset__container">
        <form className="passwordReset__form">
          <center>
            <img
              className="passwordReset__image"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="logo"
            />
          </center>
          <input
            className="passwordReset__input"
            placeholder="Email Id"
            type="email"
            value={email}
            onChange={handleEmail}
          />
          <br />
          <button className="passwordReset__button" onClick={SendResetLink}>
            Send Password Reset Link
          </button>
        </form>

        {/* TODO: Login using facebook/ google */}
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

export default PasswordReset;
