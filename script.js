let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalContainer = document.querySelector(".modal-container");
let mainContainer = document.querySelector(".main-container");
let okBtn = document.querySelector(".ok-btn");
let textAreaContainer = document.querySelector(".textarea-container");
let lockBtnContainer = document.querySelector(".ticket-lock");
let allPriorityColor = document.querySelectorAll(".priority-color");
let toolboxColor = document.querySelectorAll(".color");
let displayAll = document.querySelector(".display-all");

let colors = ["red", "yellow", "blue", "green"];
let ticketsArr = [];


let modalPriorityColor = colors[colors.length - 1];
let addFlag = false;
let edit = false;
let removeFlag = false;
let lockClass = "fa-lock";
let unlockClass = "fa-unlock";

setModalToDefault();

//if there is data in the local storage
if(localStorage.getItem("jira_tickets")){
  ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
  ticketsArr.forEach((ticketObj) => {
    createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.idCTicket);
  })
}

for (let i = 0; i < toolboxColor.length; i++) {
    toolboxColor[i].addEventListener("click", (e) => {
        let currentToolboxColor = toolboxColor[i].classList[1];
        let filteredTickets = ticketsArr.filter((curVal, idx) => {
            return currentToolboxColor === curVal.ticketColor;
        });
        let allTicketContainer = document.querySelectorAll(".ticket-container");
        for (let i = 0; i < allTicketContainer.length; i++) {
            allTicketContainer[i].remove();
        }
        filteredTickets.forEach((curVal, idx) => {
            createTicket(curVal.ticketColor, curVal.ticketTask, curVal.idCTicket);
        });
    });

    toolboxColor[i].addEventListener("dblclick", (e) => {
        let allTicketContainer = document.querySelectorAll(".ticket-container");
        for (let i = 0; i < allTicketContainer.length; i++) {
            allTicketContainer[i].remove();
        }

        ticketsArr.forEach((curVal,idx) => {
            createTicket(curVal.ticketColor,curVal.ticketTask,curVal.idCTicket);
        })
    });
}

displayAll.addEventListener("click", (e) => {
  let allTicketContainer = document.querySelectorAll(".ticket-container");
  for (let i = 0; i < allTicketContainer.length; i++) {
      allTicketContainer[i].remove();
  }

  ticketsArr.forEach((curVal,idx) => {
      createTicket(curVal.ticketColor,curVal.ticketTask,curVal.idCTicket);
  })
});

addBtn.addEventListener("click", (e) => {
  addFlag = !addFlag;
  if (addFlag) {
    mainContainer.style.display = "none";
    modalContainer.style.display = "flex";
  } else {
    modalContainer.style.display = "none";
  }
});

removeBtn.addEventListener("click", (e) => {
  removeFlag = !removeFlag;
  if(removeFlag){
    removeBtn.classList.add("remove-btn-click");
  }
  else{
    removeBtn.classList.remove("remove-btn-click");
  }
});

allPriorityColor.forEach((colorElem, index) => {
  colorElem.addEventListener("click", (e) => {
    allPriorityColor.forEach((priorityColorElem, index) => {
      priorityColorElem.classList.remove("border");
    });
    colorElem.classList.add("border");
    modalPriorityColor = colorElem.classList[0];
  });
});

okBtn.addEventListener("click", (e) => {
  createTicket(modalPriorityColor, textAreaContainer.value);
  addFlag = false;
  setModalToDefault();
});

function createTicket(ticketColor, ticketTask, ticketID) {
    let idCTicket;
    if (ticketID == undefined) 
        idCTicket = shortid();
    else 
        idCTicket = ticketID;
    let ticketLock = document.createElement("div");
    ticketLock.setAttribute("class", "ticket-container ");
    ticketLock.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${idCTicket}</div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `;
    mainContainer.appendChild(ticketLock);

    if (ticketID === undefined){
        ticketsArr.push({ ticketColor, ticketTask, idCTicket });
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }

    handleRemove(ticketLock,idCTicket);
    handleLocks(ticketLock,idCTicket);
    handleColor(ticketLock,idCTicket);
}

function handleRemove(ticketLock,id) {
  
    ticketLock.addEventListener("click",(e)=>{
      if (removeFlag) {
        //local storage removal
        let ticketIndex = getTicketIndex(id);
        ticketsArr.splice(ticketIndex,1);
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
        //ui removal
        ticketLock.remove();
      }
    })
}


function handleLocks(ticketContainer, id) {
  let ticketLockElement = ticketContainer.querySelector(".ticket-lock");
  let ticketLock = ticketLockElement.children[0];
  let ticketTaskArea = ticketContainer.querySelector(".task-area");
  ticketLock.addEventListener("click",(e) => {
    let ticketIndex = getTicketIndex(id);
    if (ticketLock.classList.contains(lockClass)) {
      ticketLock.classList.remove(lockClass);
      ticketLock.classList.add(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", true);
    
    } else {
      ticketLock.classList.remove(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", false);
      ticketLock.classList.add(lockClass);
      ticketsArr[ticketIndex].ticketTask= ticketTaskArea.innerText;
      localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }
  });

  
}

function handleColor(ticketContainer, id) {
  let ticketColor = ticketContainer.querySelector(".ticket-color");
  let ticketLockElement = ticketContainer.querySelector(".ticket-lock");
  let ticketLock = ticketLockElement.children[0];
  ticketColor.addEventListener("click",(e) => {

    //get the index of the ticketID from the ticketsArr
    let ticketIndex = getTicketIndex(id);

    if (ticketLock.classList.contains("fa-unlock")) {
      let currentTicketColor = ticketColor.classList[1];
      let currentTicketColorIdx = colors.findIndex((color) => {
        return currentTicketColor === color;
      });
      currentTicketColorIdx++;
      let newTicketColorIdx = currentTicketColorIdx % colors.length;
      let newTicketColor = colors[newTicketColorIdx];
      ticketColor.classList.remove(currentTicketColor);
      ticketColor.classList.add(newTicketColor);

      //Update the changes to local storage(priority color change)
      ticketsArr[ticketIndex].ticketColor = newTicketColor;
      localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr)); 

    }
  });
}

function getTicketIndex(id){
  let index = ticketsArr.findIndex((ticketObj)=>{
    return ticketObj.idCTicket === id;
  });
  return index;
}

function setModalToDefault(){
  modalPriorityColor = allPriorityColor[allPriorityColor.length-1].classList[0];
  modalContainer.style.display = "none";
  textAreaContainer.value = "";
  mainContainer.style.display = "flex";
  allPriorityColor.forEach((priorityColorElem, index) => {
    priorityColorElem.classList.remove("border");
  });
  allPriorityColor[allPriorityColor.length-1].classList.add("border");
}
