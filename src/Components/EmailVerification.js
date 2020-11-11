import React, { useEffect, useState } from "react";
import "./css/EmailVerification.css";
import { useStateValue } from "../StateProvider";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

function EmailVerification({ email }) {
  const [{ user }, dispatch] = useStateValue();

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const handleSend = () => {
    // console.log("$$$$4");
    return user.sendEmailVerification();
  };

  if (loading && auth.currentUser?.emailVerified) {
    history.push("/");
    setLoading(false);
  }

  return (
    <div className="emailVerification">
      <h1>To start using the app, please verify your email address.</h1>
      <h1>Send Verification Email to {email}</h1>
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default EmailVerification;
