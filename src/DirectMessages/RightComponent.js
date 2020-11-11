import React from "react";
import "./css/RightComponent.css";
import Avatar from "@material-ui/core/Avatar";

function RightComponent() {
  return (
    <div className="right">
      <div className="right__header">
        <div className="right__icon">
          <Avatar
            className="right__iconAvatar"
            style={{ padding: "2px", width: "40px", height: "40px" }}
          />
        </div>
        <div className="header__info">
          <h3>Chat 1</h3>
          <p>Last seen...</p>
        </div>
      </div>

      <div className="right__body">
        <h3>Messages</h3>
        <h3>Messages</h3>
        <h3>Messages</h3>
      </div>
      <div className="right__footer">
        <input type="text" />
      </div>
    </div>
  );
}

export default RightComponent;
