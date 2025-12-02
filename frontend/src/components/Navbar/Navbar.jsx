import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import create_todo from "../../assets/create_todo.svg";
import view_todo from "../../assets/view_todo.svg";
import account from "../../assets/account.svg";
import logout from "../../assets/logout.svg";

const Navbar = () => {
  return (
    <div className="sidebar-container">
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
            <NavLink to="/accpop">
              <img src={account} alt="" />
              Account
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-down">
        <NavLink to="/">
          <img src={logout} alt="" />
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
