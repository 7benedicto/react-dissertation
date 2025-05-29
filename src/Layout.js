import React from "react";
import "./Layout.css";

const Layout = ({ children }) => (
  <div className="layout-wrapper">
    {children}
  </div>
);

export default Layout;
