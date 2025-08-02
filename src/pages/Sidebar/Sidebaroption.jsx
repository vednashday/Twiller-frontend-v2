import React from "react";
import "./Sidebaroption.css";
const Sidebaroption = ({ active, text, Icon }) => {
  return (
    <div className={`sidebarOptions ${active && "sidebarOptions--active"}`}>
      <Icon />
      <h2 className="sidebarOption__text">{text}</h2>
    </div>
  );
};

export default Sidebaroption;
 