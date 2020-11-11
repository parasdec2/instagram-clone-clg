import React from "react";
import "./css/ChatIcons.css";
import Avatar from "@material-ui/core/Avatar";

function ChatIcons() {
  return (
    <div className="chatIconsInfo">
      <div className="container">
        <div className="icon">
          <Avatar
            className="iconAvatar"
            style={{ padding: "2px", width: "55px", height: "55px" }}
          />
        </div>
        <div className="info">
          <h3>Chat 1</h3>
          <p>Last message</p>
        </div>
      </div>
      <div className="container">
        <div className="icon">
          <Avatar
            className="iconAvatar"
            style={{ padding: "2px", width: "55px", height: "55px" }}
          />
        </div>
        <div className="info">
          <h3>Chat 1</h3>
          <p>Last message</p>
        </div>
      </div>
      <div className="container">
        <div className="icon">
          <Avatar
            className="iconAvatar"
            style={{ padding: "2px", width: "55px", height: "55px" }}
          />
        </div>
        <div className="info">
          <h3>Chat 1</h3>
          <p>Last message</p>
        </div>
      </div>
      <div className="container">
        <div className="icon">
          <Avatar
            className="iconAvatar"
            style={{ padding: "2px", width: "55px", height: "55px" }}
          />
        </div>
        <div className="info">
          <h3>Chat 1</h3>
          <p>Last message</p>
        </div>
      </div>
    </div>
  );
}

export default ChatIcons;
