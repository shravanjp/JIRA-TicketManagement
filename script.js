let addBtn = document.querySelector(".add-btn");
let modalContainer = document.querySelector(".modal-container");
let addFlag = false;

addBtn.addEventListener("click",(e)=>{
    addFlag = !addFlag;
    if(addFlag){
        modalContainer.style.display = "flex";
    }
    else{
        modalContainer.style.display = "none";
    }
})