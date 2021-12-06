import React from "react";
import clsx from "clsx";
import style from "./home.module.scss";

function Home() {
    return (
        <div>
            {/* <div className={clsx(style.title)}>
                <div>My Blog</div>
            </div> */}
            <div
                className={clsx(style.bg)}
                style={{
                    background: "url(img/bg.jpeg) no-repeat center center",
                }}
            ></div>
        </div>
    );
}

export default Home;
