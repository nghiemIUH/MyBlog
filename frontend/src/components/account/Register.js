import React from "react";
import clsx from "clsx";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//
import { login } from "../../redux/action/user";
import { url } from "../../constant";
import style from "./Register.module.scss";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handlePassWordChange = (e) => {
        const pw_cf = e.target.value;
        const password = document.getElementById("password").value;
        if (pw_cf !== password) {
            document.getElementById("err_pw_cf").style.display = "block";
        } else {
            document.getElementById("err_pw_cf").style.display = "none";
        }
    };
    const checkUsername = (e) => {
        const username = e.target.value;
        if (username.length < 6) {
            document.getElementById("err_user").style.display = "block";
        } else {
            document.getElementById("err_user").style.display = "none";
        }
    };
    const handleSubmit = () => {
        const formData = new FormData();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const full_name = document.getElementById("full_name").value;
        const email = document.getElementById("email").value;
        const avatar = document.getElementById("avatar").files[0];

        if (username.length < 6) return;
        if (password !== document.getElementById("password_confirm").value)
            return;
        if (full_name.length === 0) return;
        if (email.length === 0) return;

        formData.append("username", username);
        formData.append("password", password);
        formData.append("full_name", full_name);
        formData.append("email", email);
        formData.append("avatar", avatar);

        axios({
            method: "POST",
            url: url + "/user/register/",
            data: formData,
        })
            .then((data) => {
                if (data.status === 200) {
                    alert(data.data.info);
                }
                if (data.status === 201) {
                    axios({
                        method: "post",
                        url: url + "/user/login/",
                        data: {
                            username,
                            password,
                        },
                    }).then((data) => {
                        localStorage.setItem(
                            "access_token",
                            data.data.access_token
                        );
                        localStorage.setItem(
                            "refresh_token",
                            data.data.refresh_token
                        );
                        const action = login(data.data.user);
                        dispatch(action);
                        navigate("/");
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className={clsx(style.register)}>
            <h2>Register</h2>
            <div className={clsx(style.reg_info)}>
                <div className={clsx(style.group)}>
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        onChange={checkUsername}
                    />
                    <div
                        style={{
                            display: "none",
                            color: "red",
                        }}
                        id="err_user"
                    >
                        &#x2715; username phải lớn hơn 6 ký tự
                    </div>
                </div>
                <div className={clsx(style.group)}>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                    />
                </div>
                <div className={clsx(style.group)}>
                    <input
                        type="password"
                        placeholder="Password confirm"
                        id="password_confirm"
                        onChange={handlePassWordChange}
                    />
                    <div
                        style={{
                            display: "none",
                            color: "red",
                        }}
                        id="err_pw_cf"
                    >
                        &#x2715; password chưa khớp
                    </div>
                </div>
                <div className={clsx(style.group)}>
                    <input type="text" placeholder="Full Name" id="full_name" />
                </div>
                <div className={clsx(style.group)}>
                    <input type="text" placeholder="Email" id="email" />
                </div>
                <div className={clsx(style.group)}>
                    <input type="file" placeholder="avatar" id="avatar" />
                </div>
            </div>
            <button type="button" onClick={handleSubmit}>
                Đăng ký
            </button>
        </div>
    );
};

export default Register;
