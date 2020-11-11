import React from "react";
import "./css/LeftComponent.css";
import CreateIcon from "@material-ui/icons/Create";
import ChatIconsInfo from "./ChatIconsInfo";

function LeftComponent() {
  const createChat = () => {
    const name = prompt("Please enter a name");
  };

  return (
    <div className="left">
      <div className="left__header">
        <h3>Direct</h3>
        <CreateIcon onClick={createChat} className="header__icon" />
      </div>
      <div className="left__chats">
        <ChatIconsInfo />
      </div>
    </div>
  );
}

export default LeftComponent;
