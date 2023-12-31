// Navbar Component

import React from "react";
import { NavLink } from "react-router-dom";

const closeNavbar = () => {
    const checkbox = document.getElementById("hamburger");
    if (checkbox.checked) checkbox.checked = false;
};

function Navbar(props) {
    return (
        <nav className="nav">
            <div className="nav__links">
                <input
                    className="nav__hamburger-checkbox"
                    id="hamburger"
                    type="checkbox"
                />
                <label className="nav__hamburger-icon" htmlFor="hamburger">
                    <img
                        className="nav__hamburger-img"
                        src={
                            process.env.PUBLIC_URL + "/icons/left-alignment.svg"
                        }
                        alt=""
                    />
                </label>

                <NavLink
                    onClick={closeNavbar}
                    className="nav__logo-link"
                    to={process.env.PUBLIC_URL + "/"}
                >
                    <img className="nav__logo" style={{ width: "30px" }} src={process.env.PUBLIC_URL + "/icons/left.png"} alt="" />
                    <span className="nav__logo">
                    &nbsp; Step by Step &nbsp;        
                    </span>
                    <img className="nav__logo" style={{ width: "30px" }} src={process.env.PUBLIC_URL + "/icons/rigth.png"} alt="" />
                </NavLink>
             
                <div className="nav__links nav__text-links">
                    <NavLink
                        onClick={closeNavbar}
                        to={process.env.PUBLIC_URL + "/"}
                    >
                        <span className="nav__link">Головна</span>
                    </NavLink>
                    <NavLink
                        onClick={closeNavbar}
                        to={process.env.PUBLIC_URL + "/categories"}
                    >
                        <span className="nav__link">Категорії</span>
                    </NavLink>
                    <NavLink
                        onClick={closeNavbar}
                        to={process.env.PUBLIC_URL + "/products"}
                    >
                        <span className="nav__link">Товари</span>
                    </NavLink>
                    <NavLink
                        onClick={closeNavbar}
                        to={process.env.PUBLIC_URL + "/categories/sale"}
                    >
                        <span className="nav__link">Розпродаж</span>
                    </NavLink>
                </div>
         
            </div>
            <div className="nav__icons">
                <NavLink
                    onClick={closeNavbar}
                    to={process.env.PUBLIC_URL + "/favorites"}
                >
                    <img
                        className="nav__icon"
                        src={process.env.PUBLIC_URL + "/icons/heart.svg"}
                        alt="Favorites"
                    />
                </NavLink>

                <NavLink
                    onClick={closeNavbar}
                    to={process.env.PUBLIC_URL + "/cart"}
                >
                    <div className="nav__cart">
                        <img
                            className="nav__icon"
                            src={process.env.PUBLIC_URL + "/icons/cart.svg"}
                            alt="Cart"
                        />
                        <div className="nav__item-indicator">
                            <p>
                                {props.cartItemsCount < 100
                                    ? props.cartItemsCount
                                    : 99}
                            </p>
                        </div>
                    </div>
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
