var editor1 = new RichTextEditor("#div_editor1");
editor1.setHTMLCode(htmlCode);

const but = document.querySelector("#upload");
but.addEventListener("click", () => {
    const data = {
        slug: but.getAttribute("slug"),
        title: document.querySelector("#title").value,
        content: editor1.getHTMLCode(),
    };
    let csrftoken = getCookie("csrftoken");

    fetch(url + "/my-post/", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
    }).then((data) => {
        if (data.status == 200) {
            alert("Cập nhật thành công");
            window.location.href = url + "/my-post/";
        } else {
            alert("Đã xảy ra lỗi vui lòng thử lại");
        }
    });
});
