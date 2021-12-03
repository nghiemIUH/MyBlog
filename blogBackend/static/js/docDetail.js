var myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1,
};

pdfjsLib.getDocument(url + "/media/" + fileURL).then((pdf) => {
    myState.pdf = pdf;
    document.getElementById("current_page").value =
        1 + "/" + myState.pdf._pdfInfo.numPages;
    render();
});

function render() {
    myState.pdf.getPage(myState.currentPage).then((page) => {
        var canvas = document.getElementById("pdf_renderer");
        var ctx = canvas.getContext("2d");

        var viewport = page.getViewport(myState.zoom);

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        page.render({
            canvasContext: ctx,
            viewport: viewport,
        });
    });
}

document.getElementById("go_previous").addEventListener("click", (e) => {
    if (myState.pdf == null || myState.currentPage == 1) return;

    myState.currentPage -= 1;
    document.getElementById("current_page").value =
        myState.currentPage + "/" + myState.pdf._pdfInfo.numPages;
    render();
});
document.getElementById("go_next").addEventListener("click", (e) => {
    if (
        myState.pdf == null ||
        myState.currentPage + 1 > myState.pdf._pdfInfo.numPages
    )
        return;

    myState.currentPage += 1;
    document.getElementById("current_page").value =
        myState.currentPage + "/" + myState.pdf._pdfInfo.numPages;
    render();
});
document.getElementById("current_page").addEventListener("keypress", (e) => {
    if (myState.pdf == null) return;

    // Get key code
    var code = e.keyCode ? e.keyCode : e.which;

    // If key code matches that of the Enter key
    if (code == 13) {
        var desiredPage = document.getElementById("current_page").valueAsNumber;

        if (desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
            myState.currentPage = desiredPage;
            document.getElementById("current_page").value = desiredPage;
            render();
        }
    }
});
document.getElementById("zoom_in").addEventListener("click", (e) => {
    if (myState.pdf == null) return;
    myState.zoom += 0.1;

    render();
});
document.getElementById("zoom_out").addEventListener("click", (e) => {
    if (myState.pdf == null) return;
    myState.zoom -= 0.1;

    render();
});
