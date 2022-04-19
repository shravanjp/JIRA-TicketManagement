let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalContainer = document.querySelector(".modal-container");
let mainContainer = document.querySelector(".main-container");
let okBtn = document.querySelector(".ok-btn");
let textAreaContainer = document.querySelector(".textarea-container");
let lockBtnContainer = document.querySelector(".ticket-lock");
let colors = ["red", "yellow", "blue", "green"];
let allPriorityColor = document.querySelectorAll(".priority-color");
let modalPriorityColor = colors[colors.length-1];
let addFlag = false;
let edit=false;
let removeFlag=false;
let lockClass = "fa-lock";
let unlockClass = "fa-unlock";


addBtn.addEventListener("click",(e) => {
    addFlag = !addFlag;
    if(addFlag){
        mainContainer.style.display="none";
        modalContainer.style.display = "flex";
    }
    else{
        modalContainer.style.display = "none";
    }
})

removeBtn.addEventListener("click",(e)=>{
    removeFlag = !removeFlag;
})

allPriorityColor.forEach((colorElem, index)=>{
    colorElem.addEventListener("click", (e)=>{
        allPriorityColor.forEach((priorityColorElem, index)=>{
            priorityColorElem.classList.remove("border")
        })
        colorElem.classList.add("border")
        modalPriorityColor = colorElem.classList[0];
    })
})


okBtn.addEventListener("click",(e) => {
    createTicket(modalPriorityColor, shortid(), textAreaContainer.value);
    modalContainer.style.display="none";
    addFlag=false;
    textAreaContainer.value = "";
    mainContainer.style.display="flex";
})


function createTicket(ticketColor, ticketID, ticketTask) {
    let ticketLock = document.createElement("div");
    ticketLock.setAttribute("class","ticket-container ");
    ticketLock.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${ticketID}</div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `;
    mainContainer.appendChild(ticketLock);
    handleRemove(ticketLock);
    handleLock(ticketLock);
}

function handleRemove(ticketLock){
    if(removeFlag){
        ticketLock.remove();
    }
}
function handleLock(ticketContainer){
    let ticketLockElement = ticketContainer.querySelector(".ticket-lock");
    let ticketLock = ticketLockElement.children[0];
    let ticketTaskArea = ticketContainer.querySelector(".task-area");
    ticketLock.addEventListener("click",(e)=>{
        if(ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable",true);
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable",true);
        }
    })
}