import React from "react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import style from "./Login.module.scss";
import { url } from "../../constant";
import { login } from "../../redux/action/user";

function Login() {
    const dispatch = useDispatch();

    let navigate = useNavigate();

    const handleLogin = () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        axios({
            method: "post",
            url: url + "/user/login/",
            data: {
                username,
                password,
            },
        }).then((data) => {
            localStorage.setItem("access_token", data.data.access_token);
            localStorage.setItem("refresh_token", data.data.refresh_token);
            const action = login(data.data.user);
            dispatch(action);
            navigate("/");
        });
    };
    return (
        <div className={clsx(style.login)}>
            <h2>Login</h2>
            <div className={clsx(style.login_info)}>
                <div className={clsx(style.group)}>
                    <input type="text" id="username" placeholder="Username" />
                </div>
                <div className={clsx(style.group)}>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                    />
                </div>
            </div>
            <div className={clsx(style.other)}>
                <Link to="/forgot-password">Quên mật khẩu</Link>
                <Link to="/register">Đăng ký</Link>
            </div>
            <button type="button" onClick={handleLogin}>
                Đăng Nhập
            </button>
        </div>
    );
}

export default Login;
