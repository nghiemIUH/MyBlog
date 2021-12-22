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
        const access_token = sessionStorage.getItem("access_token");
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
                const refresh_token = sessionStorage.getItem("refresh_token");
                axios({
                    method: "post",
                    url: url + "/user/refresh/",
                    data: {
                        refresh: refresh_token,
                    },
                })
                    .then((data) => {
                        sessionStorage.setItem(
                            "access_token",
                            data.data.access
                        );
                        sessionStorage.setItem(
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
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
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
                                className={clsx(style.menu_item)}
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
                            <button>Đăng nhập</button>
                        </Link>
                        <Link to="/register">
                            <button>Đăng ký</button>
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
                            <div className={clsx(style.menu_user)}>
                                <div>
                                    <i className="far fa-id-badge"></i>
                                    <span>Profile</span>
                                </div>
                                <div>
                                    <i class="fas fa-tasks"></i>
                                    <span onClick={show}>
                                        <Link
                                            to="/manage-blog"
                                            className={clsx(style.menu_item)}
                                        >
                                            Mange Blog
                                        </Link>
                                    </span>
                                </div>
                                <div onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i>
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
