const edit = (e) => {
    const slug = e.getAttribute("slug");
    window.location.href = url + "/edit/" + slug;
};

const del = (e) => {
    let csrftoken = getCookie("csrftoken");
    const data = {
        _id: e.getAttribute("id_post"),
    };

    const cf = confirm("Bạn có chắc muốn xóa");
    if (!cf) return;

    fetch(url + "/my-post/", {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
    }).then((data) => {
        window.location.reload();
    });
};
