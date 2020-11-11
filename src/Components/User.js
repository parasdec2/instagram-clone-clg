import { Avatar } from "@material-ui/core";
import React from "react";
import { useStateValue } from "../StateProvider";

function User() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="user">
      <div className="user__headerContainer">
        <div className="user__avtar">
          <Avatar src={user.photoUrl} />
        </div>
        <div className="user__deatils">
          <p>{user.displayName}</p>
        </div>
      </div>
    </div>
  );
}

export default User;
