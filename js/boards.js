function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const card = document.getElementById(data);
  const targetBoard = ev.target.closest(".board");
  if (targetBoard) {
    targetBoard.querySelector(".card-list").appendChild(card);
    saveBoardsToLocalStorage();
  }
}

function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

document.querySelectorAll(".add-card").forEach((button) => {
  button.addEventListener("click", function () {
    const board = this.parentElement;
    const cardList = board.querySelector(".card-list");

    const newCardId = `card-${Date.now()}`;
    cardList.insertAdjacentHTML(
      "beforeend",
      `
      <li class="card" id="${newCardId}" draggable="true">
        <input type="text" class="card-title-input" placeholder="Card Title" readonly />
        <textarea class="card-content-textarea" placeholder="Content for the new card" readonly></textarea>
        <button class="remove-card-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg></button>
      </li>
    `
    );

    const newCard = cardList.lastElementChild;

    addRemoveCardEvent(newCard.querySelector(".remove-card-btn"));
    addCardEditEvent(newCard);

    const newTextarea = newCard.querySelector(".card-content-textarea");
    autoResizeTextarea(newTextarea);
    newTextarea.addEventListener("input", function () {
      autoResizeTextarea(newTextarea);
      saveBoardsToLocalStorage();
    });

    newCard.addEventListener("dragstart", drag);
    saveBoardsToLocalStorage();
  });
});

function addRemoveCardEvent(button) {
  button.addEventListener("click", function () {
    const card = this.parentElement;
    card.remove();
    saveBoardsToLocalStorage();
  });
}

function addCardEditEvent(card) {
  const titleInput = card.querySelector(".card-title-input");
  const contentTextarea = card.querySelector(".card-content-textarea");

  titleInput.addEventListener("click", function () {
    titleInput.removeAttribute("readonly");
  });

  titleInput.addEventListener("blur", function () {
    titleInput.setAttribute("readonly", true);
    saveBoardsToLocalStorage();
  });

  contentTextarea.addEventListener("click", function () {
    contentTextarea.removeAttribute("readonly");
  });

  contentTextarea.addEventListener("blur", function () {
    contentTextarea.setAttribute("readonly", true);
    saveBoardsToLocalStorage();
  });
}

function saveBoardsToLocalStorage() {
  const boards = document.querySelectorAll(".board");
  const boardData = {};

  boards.forEach((board) => {
    const boardTitle = board.querySelector(".board-title").innerText;
    const cards = Array.from(board.querySelectorAll(".card")).map((card) => ({
      title: card.querySelector(".card-title-input").value,
      content: card.querySelector(".card-content-textarea").value,
      id: card.id,
    }));

    boardData[boardTitle] = cards;
  });

  localStorage.setItem("boards", JSON.stringify(boardData));
}

function loadBoardsFromLocalStorage() {
  const storedBoards = JSON.parse(localStorage.getItem("boards"));
  if (storedBoards) {
    for (const boardTitle in storedBoards) {
      const board = Array.from(document.querySelectorAll(".board")).find(
        (b) => b.querySelector(".board-title").innerText === boardTitle
      );
      if (board) {
        storedBoards[boardTitle].forEach((card) => {
          const newCardId = card.id;
          const newCardHTML = `
            <li class="card" id="${newCardId}" draggable="true">
        <input type="text" class="card-title-input" placeholder="Card Title" readonly />
        <textarea class="card-content-textarea" placeholder="Content for the new card" readonly></textarea>
        <button class="remove-card-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg></button>
      </li>
          `;
          board
            .querySelector(".card-list")
            .insertAdjacentHTML("beforeend", newCardHTML);

          const newCard = board.querySelector(`#${newCardId}`);
          addRemoveCardEvent(newCard.querySelector(".remove-card-btn"));
          addCardEditEvent(newCard);
          const newTextarea = newCard.querySelector(".card-content-textarea");
          autoResizeTextarea(newTextarea);
          newTextarea.addEventListener("input", function () {
            autoResizeTextarea(newTextarea);
            saveBoardsToLocalStorage();
          });

          newCard.addEventListener("dragstart", drag);
        });
      }
    }
  }
}

document.querySelectorAll(".card-content-textarea").forEach((textarea) => {
  autoResizeTextarea(textarea);
  textarea.addEventListener("input", function () {
    autoResizeTextarea(textarea);
  });
});

loadBoardsFromLocalStorage();
