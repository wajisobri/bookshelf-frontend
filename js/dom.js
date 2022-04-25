const UNCOMPLETED_BOOK_LIST = "incompleteBookshelfList";
const COMPLETED_BOOK_LIST ="completeBookshelfList";
const BOOK_ITEMID = "itemId";

function changeTextSubmit(buttonElement, isChecked) {
    if(isChecked) {
        buttonElement.innerText = "Selesai dibaca";
    } else {
        buttonElement.innerText = "Belum selesai dibaca";
    }
}

function makeBook(id, title, author, year, isCompleted) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis: " + author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: " + year;

    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book_item")
    bookContainer.setAttribute("id", id);
    bookContainer.append(textTitle, textAuthor, textYear);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    bookContainer.append(actionContainer);
    
    if(isCompleted){
        actionContainer.append(
            createUndoButton(),
            createTrashButton(),
            createEditButton()
        );
    } else {
        actionContainer.append(
            createDoneButton(),
            createTrashButton(),
            createEditButton()
        );
    }

    return bookContainer;
}

function createDoneButton() {
    return createButton("green", "Selesai dibaca", function(event){
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("red", "Hapus buku", function(event){
        const confirmDelete = confirm('Anda yakin akan menghapus buku ini?');
        if(confirmDelete) {
            removeBook(event.target.parentElement.parentElement);
            alert("Buku telah dihapus");
        }
    });
}

function createUndoButton() {
    return createButton("green", "Belum selesai dibaca", function(event){
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createEditButton() {
    return createButton("blue", "Edit Buku", function(event){
        document.getElementById("editBookTitle").disabled = false;
        document.getElementById("editBookAuthor").disabled = false;
        document.getElementById("editBookYear").disabled = false;
        document.getElementById("editSubmit").disabled = false;
        document.getElementById("editCancel").disabled = false;
        editBook(event.target.parentElement.parentElement);
    });
}

function createButton(buttonClass, buttonText, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonClass);
    button.innerText = buttonText;
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    
    return button;
}

function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_BOOK_LIST);
    const completedBookList = document.getElementById(COMPLETED_BOOK_LIST);

    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;
    const inputIsCompleted = document.getElementById("inputBookIsComplete").checked;

    const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, inputIsCompleted);
    const book = makeBook(bookObject.id, inputTitle, inputAuthor, inputYear, inputIsCompleted);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if(inputIsCompleted) {
        completedBookList.append(book);
    } else {
        uncompletedBookList.append(book);
    }

    updateDataToStorage();
}

function addBookToCompleted(bookElement) {
    const completedBookList = document.getElementById(COMPLETED_BOOK_LIST);

    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookElement.id, bookTitle, bookAuthor, bookYear, true);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    completedBookList.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBook(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();

    updateDataToStorage();
}

function undoBookFromCompleted(bookElement){
    const uncompletedBookList = document.getElementById(UNCOMPLETED_BOOK_LIST);

    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookElement.id, bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    uncompletedBookList.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function filterBook(bookTitle) {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_BOOK_LIST);
    const completedBookList = document.getElementById(COMPLETED_BOOK_LIST);

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    bookTitle = bookTitle.replace(/\s+/g, ' ').trim();
    
    for(book of books){
        if(book.title.toUpperCase().search(bookTitle.toUpperCase()) != -1) {
            const newBook = makeBook(book.id, book.title, book.author, book.year, book.isCompleted);
            newBook[BOOK_ITEMID] = book.id;

            if(book.isCompleted){
                completedBookList.append(newBook);
            } else {
                uncompletedBookList.append(newBook);
            }
        }
    }
}

function searchBook() {
    const inputTitle = document.getElementById("searchBookTitle").value;
    filterBook(inputTitle);
}

function editBook(bookElement) {
    const bookId = bookElement.id;
    
    const getBookDetail = findBook(Number(bookId));
    document.getElementById("editBookId").value = getBookDetail.id;
    document.getElementById("editBookTitle").value = getBookDetail.title;
    document.getElementById("editBookAuthor").value = getBookDetail.author;
    document.getElementById("editBookYear").value = getBookDetail.year;
    document.querySelector(".edit_section > h2 > span").innerText = ": " + getBookDetail.title;
}

function updateBook() {
    const id = document.getElementById("editBookId").value;
    const title = document.getElementById("editBookTitle").value;
    const author = document.getElementById("editBookAuthor").value;
    const year = document.getElementById("editBookYear").value;

    for(book of books) {
        if(book.id === Number(id)) {
            book.title = title;
            book.author = author;
            book.year = year;
        }
    }
    
    updateDataToStorage();
    document.querySelector(".edit_section > h2 > span").innerText = "";
    refreshDataFromBooks();
}