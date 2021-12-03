const username = document.querySelector("#username");
const password = document.querySelector("#password");
const but = document.querySelector("#submit_login");

but.addEventListener("click", async () => {
    var data = {
        username: username.value,
        password: password.value,
    };
    let csrftoken = getCookie("csrftoken");
    await fetch("/user/login/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
    }).then((data) => {
        if (data.status == 200) {
            window.location.href = url;
        } else {
            document.querySelector("#err").style.display = "block";
        }
    });
});
