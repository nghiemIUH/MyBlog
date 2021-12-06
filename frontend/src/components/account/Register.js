import React from "react";
import clsx from "clsx";

import style from "./Register.module.scss";
function Register() {
    return (
        <div className={clsx(style.register)}>
            <h2>Register</h2>
            <div className={clsx(style.reg_info)}>
                <div className={clsx(style.group)}>
                    <input type="text" placeholder="Username" />
                </div>
                <div className={clsx(style.group)}>
                    <input type="password" placeholder="Password" />
                </div>
                <div className={clsx(style.group)}>
                    <input type="password" placeholder="Password confirm" />
                </div>
                <div className={clsx(style.group)}>
                    <input type="text" placeholder="Full Name" />
                </div>
                <div className={clsx(style.group)}>
                    <input type="text" placeholder="Email" />
                </div>
                <div className={clsx(style.group)}>
                    <input type="file" placeholder="avatar" />
                </div>
            </div>
            <button type="button">Đăng ký</button>
        </div>
    );
}

export default Register;
