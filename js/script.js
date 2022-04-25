document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    const searchForm = document.getElementById("searchBook");
    const editForm = document.getElementById("editBook");
    const editCancelButton = document.getElementById("editCancel");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
        alert("Buku telah ditambahkan");
        document.getElementById("inputBook").reset();
        document.querySelector("#inputBook > button > span").innerText = "Belum selesai dibaca";
    });

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        updateBook();
        alert("Buku telah diperbarui");
        document.getElementById("editBook").reset();

        document.getElementById("editBookTitle").disabled = true;
        document.getElementById("editBookAuthor").disabled = true;
        document.getElementById("editBookYear").disabled = true;
        document.getElementById("editSubmit").disabled = true;
        document.getElementById("editCancel").disabled = true;
    });

    editCancelButton.addEventListener("click", function (event) {
        event.preventDefault();
        
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});

const inputChecbox = document.getElementById("inputBookIsComplete");
inputChecbox.addEventListener("change", function() {
    const textSubmit = document.querySelector("#inputBook > button > span");
    changeTextSubmit(textSubmit, inputChecbox.checked);
});