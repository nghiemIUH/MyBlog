const avatar = document.querySelector("#avatar");
avatar.addEventListener("change", () => {
    document.querySelector(".file_name").innerHTML = avatar.files[0].name;
});

const pass = document.querySelector("#password");
const passCF = document.querySelector("#password_cf");
passCF.addEventListener("change", () => {
    console.log(pass.value.trim() != passCF.value.trim());
    if (pass.value.trim() != passCF.value.trim()) {
        document.getElementById("pscf_err").style.display = "block";
    } else {
        document.getElementById("pscf_err").style.display = "none";
    }
});

const submitSignin = document.querySelector("#submitSignin");
submitSignin.addEventListener("click", () => {
    let formData = new FormData();
    if (
        pass.value.trim() !== passCF.value.trim() &&
        checkEmpty(
            document.getElementById("username"),
            document.getElementById("usr_err")
        ) &&
        checkEmpty(
            document.getElementById("full_name"),
            document.getElementById("fn_err")
        )
    )
        return;

    formData.append("username", document.querySelector("#username").value);
    formData.append("full_name", document.querySelector("#full_name").value);
    formData.append("password", pass.value);
    formData.append("email", document.querySelector("#email").value);
    formData.append("avatar", document.querySelector("#avatar").files[0]);

    fetch(url + "/user/signup/", {
        method: "POST",
        body: formData,
    })
        .then((data) => {
            if (data.status == 201) {
                window.location.href = url + "/user/login/";
            } else {
                return data.json();
            }
        })
        .then((data) => {
            const err = document.querySelector("#err");
            err.innerHTML = data.error;
            err.style.display = "block";
        });
});

const checkEmpty = (checkEle, errEle) => {
    checkEle.addEventListener("blur", () => {
        const text = checkEle.value;
        if (text.trim() == "") {
            errEle.style.display = "block";
            return false;
        } else {
            errEle.style.display = "none";
            return true;
        }
    });
};
