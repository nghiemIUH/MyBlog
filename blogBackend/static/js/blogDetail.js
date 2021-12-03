const repOpenClose = (e) => {
    const id = e.getAttribute("id");
    const element = document.getElementById("rep_" + id);
    let display = element.style.display;
    if (display == "") {
        display = "block";
    } else {
        display = "";
    }
    element.style.display = display;
};

let wsStart = "ws://";
if (window.location.protocol == "https:") {
    wsStart = "wss://";
}

const endPoint =
    wsStart + window.location.host + window.location.pathname + "/";

const btn_comment = document.getElementById("btn_comment");
const webSocket = new WebSocket(endPoint);
btn_comment.addEventListener("click", () => {
    /**
     * user id
     * blog id
     * content
     */

    const content = document.getElementById("comment_ipt").value;

    const data = {
        slug: slug,
        content: content,
    };

    webSocket.onerror = (e) => {
        console.log("Error occured! ", e);
    };
    webSocket.onopen = (e) => {
        console.log("open");
    };

    webSocket.send(JSON.stringify(data));
});
webSocket.onmessage = (e) => {
    const data = JSON.parse(e.data).message;

    const comment = `
    <div class="comment">
    <img src="${data.user_avatar}" alt="" >
    <div class="comment_info">
        <div class="comment_content">${data.content}</div>
        <div class="comment_date">
            <i class="far fa-clock"></i>
            <div style="margin: 5px;">${data.time}</div>
            <div type="button" class="rep_btn" id="${data.comment_id}"
                onclick="repOpenClose(this)"
            >Trả lời</div>
            
        </div>
        <div class="rep_container" id="rep_${data.comment_id}">
                <textarea  id="rep_ipt" placeholder="Trả lời ..."></textarea>
                <button>Trả lời</button>
        </div>
        </div>
    </div>

    `;
    document
        .getElementById("comment_content")
        .insertAdjacentHTML("beforeend", comment);
    document.getElementById("comment_ipt").value = "";
};
