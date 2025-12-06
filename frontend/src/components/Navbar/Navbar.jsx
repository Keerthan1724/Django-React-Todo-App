import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import create_todo from "../../assets/create_todo.svg";
import view_todo from "../../assets/view_todo.svg";
import account from "../../assets/account.svg";
import logout from "../../assets/logout.svg";
import { notify } from "../../utils/toastHelper";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    notify("You logged out of APP!", "error");
  };

  return (
    <>
      <div className="top-bar">
        <button className="mobile-hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <h4 className="top-logo">📝 TODO APP</h4>
      </div>

      <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h4> 📝 TODO APP</h4>
        </div>

        <div className="sidebar-up">
          <ul className="sidebar-compo">
            <li>
              <NavLink to="/create">
                <img src={create_todo} alt="" />
                Create New Todo
              </NavLink>
            </li>
            <li>
              <NavLink to="/view">
                <img src={view_todo} alt="" />
                View Todo List
              </NavLink>
            </li>
            <li>
              <NavLink to="/account">
                <img src={account} alt="" />
                Account
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebar-down">
          <NavLink to="/" onClick={handleLogout}>
            <img src={logout} alt="" />
            Logout
          </NavLink>
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default Navbar;
