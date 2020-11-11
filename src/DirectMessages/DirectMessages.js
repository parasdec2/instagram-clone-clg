import React from "react";
import "./css/DirectMessages.css";
import LeftComponent from "./LeftComponent";
import RightComponent from "./RightComponent";
function DirectMessages() {
  return (
    <div className="directMessages">
      <div className="directMessages__leftComponent">
        <LeftComponent />
      </div>
      <div className="directMessages__rightComponent">
        <RightComponent />
      </div>
    </div>
  );
}

export default DirectMessages;
