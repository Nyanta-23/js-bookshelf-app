const arrayBook = [];
const RENDER_EVENT = 'render-books';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const buttonSearch = document.getElementById('searchSubmit');

    submitForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addBook();
    });


    if (isStorageExist()) {
        loadDataFromStorage();
    }

});


function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const writer = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const completeToRead = isComplete();
    const id = generatedId();

    const inputToArrayObject = generateBookToObject(id, title, writer, year, completeToRead);
    arrayBook.push(inputToArrayObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


document.addEventListener(RENDER_EVENT, function () {
    const incompleteBook = document.getElementById('incompleteBookshelfList');
    const completeBook = document.getElementById('completeBookshelfList');
    incompleteBook.innerHTML = '';
    completeBook.innerHTML = '';



    for (const dataBook of arrayBook) {



        const createBox = createBoxElement(dataBook);
        if (!dataBook.isComplete) {
            incompleteBook.append(createBox);
        } else {
            completeBook.append(createBox);
        }
    }

});


function generatedId() {
    return +new Date();
}


function isComplete() {
    const booleanComplete = document.getElementById('inputBookIsComplete').checked;
    return booleanComplete;
}


function generateBookToObject(id, titleBook, writerBook, yearOfBook, isComplete) {
    return {
        id,
        titleBook,
        writerBook,
        yearOfBook,
        isComplete,
    }
}


function createBoxElement(objectBook) {
    const articleElement = document.createElement('article');
    const bookTitle = document.createElement('h3');
    const bookWriter = document.createElement('p');
    const yearBook = document.createElement('p');

    articleElement.setAttribute('class', 'book_item');
    bookTitle.innerText = objectBook.titleBook;
    bookWriter.innerText = objectBook.writerBook;
    yearBook.innerText = objectBook.yearOfBook;
    articleElement.append(bookTitle, bookWriter, yearBook);


    const actionElement = document.createElement('action');
    const greenButton = document.createElement('button');
    const redButton = document.createElement('button');
    actionElement.setAttribute('class', 'action');
    greenButton.setAttribute('class', 'green');
    redButton.setAttribute('class', 'red');
    actionElement.append(greenButton, redButton);
    articleElement.append(actionElement);

    redButton.innerText = 'Hapus buku';


    if (objectBook.isComplete == false) {
        greenButton.addEventListener('click', function () {
            toCompleteBookshelf(objectBook.id);
        });
        greenButton.innerText = 'Selesai di Baca';

        redButton.addEventListener('click', function () {
            removeBook(objectBook.id);
        });

    } else {
        greenButton.addEventListener('click', function () {
            toUncompleteBookShelf(objectBook.id);
        });
        greenButton.innerText = 'Belum selesai di Baca';

        redButton.addEventListener('click', function () {
            removeBook(objectBook.id);
        });
    }

    return articleElement;
}



function findBookIndex(bookId) {
    for (let index in arrayBook) {
        if (arrayBook[index].id === bookId) {
            return index;
        }
    }
    return -1;
}



function findBook(bookId) {
    for (const bookItem of arrayBook) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}


function toCompleteBookshelf(bookId) {
    const bookData = findBook(bookId);


    if (bookData == null) return;

    bookData.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function toUncompleteBookShelf(bookId) {
    const bookData = findBook(bookId);

    if (bookData == null) return;

    bookData.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex === -1) return;

    arrayBook.splice(bookIndex, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();


}


const BOOK_STORAGE_KEY = 'BOOK_APP';
const SAVED_EVENT = 'saved-book';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(arrayBook);
        localStorage.setItem(BOOK_STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


function isStorageExist() {
    if (typeof (Storage) == undefined) {
        alert('Tidak support ke local storage');
        return false;
    }
    return true;
}


document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(BOOK_STORAGE_KEY));

});


function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOK_STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bookData of data) {
            arrayBook.push(bookData);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}