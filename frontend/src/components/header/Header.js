import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import style from "./Header.module.scss";
import { url } from "../../constant";
import { login, logout } from "../../redux/action/user";

const MENU = {
    Home: "/",
    Blog: "/blog",
};

function Header() {
    const [visible, setVisible] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [active, setActive] = useState("Home");
    const [showMenu, setshowMenu] = useState(false);

    const stateUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");
        if (access_token === null) {
            return;
        }
        axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            url: url + "/user/check-login/",
        })
            .then((data) => {
                dispatch(login(data.data));
            })
            .catch((error) => {
                const refresh_token = localStorage.getItem("refresh_token");
                axios({
                    method: "post",
                    url: url + "/user/refresh/",
                    data: {
                        refresh: refresh_token,
                    },
                })
                    .then((data) => {
                        localStorage.setItem("access_token", data.data.access);
                        localStorage.setItem(
                            "refresh_token",
                            data.data.refresh
                        );
                    })
                    .catch((error) => {
                        dispatch(logout({}));
                    });
            });
    }, [active, dispatch]);

    useEffect(() => {
        const windowSize = window.matchMedia("(max-width: 700px)");
        windowSize.addEventListener("change", handleMediaQueryChange);
        handleMediaQueryChange(windowSize);
        return () => {
            windowSize.removeEventListener("change", handleMediaQueryChange);
        };
    }, []);

    useEffect(() => {
        const pageClickEvent = (e) => {
            if (
                dropdownRef.current !== null &&
                !dropdownRef.current.contains(e.target)
            ) {
                setshowMenu(!showMenu);
            }
        };

        if (showMenu) {
            window.addEventListener("click", pageClickEvent);
        }

        return () => {
            window.removeEventListener("click", pageClickEvent);
        };
    }, [showMenu, dropdownRef]);

    const handleMediaQueryChange = (mediaQuery) => {
        if (mediaQuery.matches) {
            setIsSmall(true);
        } else {
            setIsSmall(false);
        }
    };

    const toggle = () => {
        setVisible(!visible);
    };

    const show = () => {
        setshowMenu(!showMenu);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(logout({}));
        window.location.reload();
    };

    return (
        <div className={clsx(style.header)} ref={dropdownRef}>
            <img src="/logo192.png" alt="" className={clsx(style.logo)} />
            <div
                className={clsx(style.nav)}
                id="myTopnav"
                style={{ display: visible || !isSmall ? "grid" : "none" }}
            >
                <div className={clsx(style.menu)}>
                    {Object.keys(MENU).map((key, index) => {
                        return (
                            <Link
                                to={MENU[key]}
                                key={index}
                                style={
                                    key === active
                                        ? {
                                              color: "red",
                                          }
                                        : { color: "#fff" }
                                }
                                onClick={() => {
                                    setActive(key);
                                }}
                            >
                                {key}
                            </Link>
                        );
                    })}
                </div>

                {Object.keys(stateUser).length === 0 ? (
                    <div className={clsx(style.account)}>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </div>
                ) : (
                    <div className={clsx(style.account)}>
                        <img
                            src={url + stateUser.avatar}
                            alt=""
                            className={clsx(style.avatar)}
                            onClick={show}
                        />

                        {showMenu ? (
                            <div className={clsx(style.menu)}>
                                <div>
                                    <i class="far fa-id-badge"></i>
                                    <span>Profile</span>
                                </div>
                                <div onClick={handleLogout}>
                                    <i class="fas fa-sign-out-alt"></i>
                                    <span>Logout</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            <button onClick={toggle} className={clsx(style.open)}>
                <i className="fa fa-bars"></i>
            </button>
        </div>
    );
}

export default Header;
