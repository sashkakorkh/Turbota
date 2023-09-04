import * as flsFunctions from "./modules/functions.js";
import {openVisitModal} from './modules/creatingVisit.js'
import {creatingSelectObject} from './modules/functions.js'
import {openLogin, token} from './modules/login.js'
import {cardVisit} from './modules/cardVisit.js'
import {editCard} from "./modules/editCard.js";

flsFunctions.isWebp();

//select-custom


/*==========================================*/
// log-in
/*==========================================*/

openLogin()
creatingSelectObject('[data-custom]')




/*==========================================*/
/*Modal create visit*/
/*==========================================*/
openVisitModal()

// Фільтр input
let input =document.querySelector(".filters__search")
let visitContainer = document.getElementById('visitContainer');

function fil (){
    let card=document.querySelectorAll(".visit__form_patient")
    let filter=input.value.toLowerCase()
    card.forEach(el=>{
         if (el.innerHTML.toLowerCase().indexOf(filter)>-1){
        el.parentNode.style.display="grid"
  }
else {
    el.parentNode.style.display="none"
}

})

}
input.addEventListener("keyup",fil)

let seach =document.querySelector(".btn__search")
console.log(seach)
function seachSelector (e) {
    e.preventDefault()
    const status = document.querySelector('[data-custom]')
  console.log(status)  

    const selectedStatus = status.nextElementSibling.querySelector('.selected').outerText
    let statusCard=document.getElementById('visitContainer').children
    console.log(statusCard)
    Array.from(statusCard).forEach(st=>{if (st.dataset.name==selectedStatus.toLowerCase()){
        st.style.display="grid"
    }
else {
    st.style.display="none"
}})

}
seach.addEventListener("click",seachSelector)

let inputStatus = document.querySelectorAll(".custom-select-container")
inputStatus.forEach(element=>element.addEventListener("click", (e)=> {
    
    let selectedStatus=e.target.getAttribute('data-value');
    
    let cards=document.getElementById('visitContainer').children;
   
    Array.from(cards).forEach(card=>{
        if (card.dataset.urg==selectedStatus||card.dataset.name==selectedStatus){
        card.style.display="grid"
    }
    else {card.style.display="none"}
})
}))
