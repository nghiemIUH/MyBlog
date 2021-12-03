var editor1 = new RichTextEditor("#div_editor1");

const btnUpload = document.querySelector("#upload");
btnUpload.addEventListener("click", () => {
    const title = document.querySelector("#title").value;
    if (title.trim() == "") {
        alert("Tiêu đề không được rỗng");
        return;
    }
    const content = editor1.getHTMLCode();
    if (content.trim() == "") {
        alert("Nội dung không được rỗng");
        return;
    }
    const data = {
        title: title,
        content: content,
    };
    let csrftoken = getCookie("csrftoken");

    fetch(url + "/write/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
    }).then((data) => {
        alert("Thêm thành công");
        window.location.href = url;
    });
});
