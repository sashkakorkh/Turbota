import {token} from './login.js'
import {editCard} from "./editCard.js";
let visitContainer = document.getElementById('visitContainer');

export class Visit {
    constructor (doctor,name,purpose,description,urgency,id,status,doctorname){
        this.doctor=doctor
        this.name=name
        this.purpose=purpose
        this.description=description
        this.urgency=urgency
        this.id=id   
        this.status=status
        this.doctorname=doctorname   
    }
        render () {

            let visitCard = `<div data-urg="${this.urgency}" data-name="${this.status}" data-id="${this.id}" class="visit__form">
            <div data-id ="button${this.id}" class="visit__form_delete"></div>
            
            <p class="visit__form_patient">Patient: ${this.name}</p>
            <p>Doctor: ${this.doctorname}</p>
           
           
            <div data-id='visit${this.id}' class="visit__form_button">
            <button data-id ="morebutton${this.id}"  class="visit__form_more">Show more</button>
            <button  data-id ="editbtn${this.id}" class="visit__form_edit">Edit</button>
            </div>
            </div>
            `
            console.log(`${this.urgency}`)
            visitContainer.insertAdjacentHTML('beforeend',visitCard)
            const botton = document.querySelector(`[data-id='button${this.id}']`)
            botton.addEventListener('click', () => {
             deleteCard(this.id) 

              

            
             })
             
    let editButton=document.querySelector(`[data-id='editbtn${this.id}']`)
    editButton.addEventListener('click', async () => {await editCard(token,this.id)
    console.log(editButton)})

             let button=document.querySelector(`[data-id='morebutton${this.id}']`)

            button.addEventListener('click', () => {
            more(this.id)})
        }
}

class VisitDantist extends Visit {
    constructor (doctor,name,purpose,description,urgency,id,status,doctorname,date){
        super(doctor,name,purpose,description,urgency,id,status,doctorname)
        this.date=date
    }
    render(){
        let visitDantistContainer=` 
        <p>Status: ${this.status}</p>
        <p>Purpose of the visit: ${this.purpose}</p>
        <p>Brief description of the visit: ${this.description}</p>
        <p>Urgensy: ${this.urgency}</p>
        <p>Date of last visit: ${this.date}</p>
        `
        let visitcontent=document.querySelector(`[data-id='visit${this.id}']`)
        visitcontent.insertAdjacentHTML('beforebegin',visitDantistContainer)

    }
}


class VisitTherapist extends Visit {
    constructor (doctor,name,purpose,description,urgency,id,status,doctorname,ageInTerapist){
        super(doctor,name,purpose,description,urgency,id,status,doctorname)
        this.ageInTerapist=ageInTerapist
    }
    render(){
        let visitTherapistContainer=` 
        <p>Status: ${this.status}</p>
        <p>Purpose of the visit: ${this.purpose}</p>
        <p>Brief description of the visit: ${this.description}</p>
        <p>Urgensy: ${this.urgency}</p>
        <p>Age: ${this.ageInTerapist}</p>
        `
        let visitcontent=document.querySelector(`[data-id='visit${this.id}']`)
        visitcontent.insertAdjacentHTML('beforebegin',visitTherapistContainer)

    }
}


class VisitCardiolog extends Visit {
    constructor (doctor,name,purpose,description,urgency,id,status,doctorname,age,bloodpressure,bmi,diseases){
        super(doctor,name,purpose,description,urgency,id,status,doctorname)
        this.age=age
        this.bloodpressure=bloodpressure
        this.bmi=bmi
        this.diseases=diseases

    }
    render(){
        let visitCardiologContainer=` 
        <p>Status: ${this.status}</p>
        <p>Purpose of the visit: ${this.purpose}</p>
        <p>Brief description of the visit: ${this.description}</p>
        <p>Urgensy: ${this.urgency}</p>
        <p>Age: ${this.age}</p>
        <p>Bloodpressure: ${this.bloodpressure}</p>
        <p>Body Mass Index: ${this.bmi}</p>
        <p>Transferred diseases of the cardiovascular system: ${this.diseases}</p>

        `
        let visitcontent=document.querySelector(`[data-id='visit${this.id}']`)
        visitcontent.insertAdjacentHTML('beforebegin',visitCardiologContainer)

    }
}

export  function cardVisit() {
  visitContainer.innerHTML=``
 
  fetch("https://ajax.test-danit.com/api/v2/cards",

{
  method: 'GET',
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}})

.then(response => response.json())
.then(card => {card.map(el=>{
  
  if (card.length<=1){
    document.getElementById("h1").textContent="No items have been added"
  }
  if(el.doctor){
    document.getElementById("h1").textContent=""
    let visit = new Visit (el.doctor,el.name,el.purpose,el.visitDescription,el.urgency,el.id,el.status,el.doctorname)
 
        visit.render()
        
    }})})

.catch(error => console.log(error))
}


function deleteCard(id) {
    if (confirm('Are you sure you want to delete this post?')) {
      fetch(`https://ajax.test-danit.com/api/v2/cards/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }})
      
        .then(() => {
          alert('Post deleted');
          const div = document.querySelector(`[data-id='${id}']`)

            visitContainer.removeChild(div)
            valid()
           })
    }
    
}

function valid(){

  fetch("https://ajax.test-danit.com/api/v2/cards",

{
  method: 'GET',
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}})

.then(response => response.json())
.then(card => {card.map(el=>{
  
  if (card.length<=1){
    document.getElementById("h1").textContent="No items have been added"
  }
})})
}
function more(id) {
  fetch(`https://ajax.test-danit.com/api/v2/cards/${id}`,
  {
    method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }})
  
  .then(response => response.json())
  .then(el => {if(el.doctorname=="therapist") {
    let visitTherapist = new VisitTherapist (el.doctor,el.name,el.purpose,el.visitDescription,el.urgency,el.id,el.status,el.doctorname,el.ageInTherapist)   
    visitTherapist.render()
    let btnShow=document.querySelector(`[data-id ="morebutton${id}"]`)

    btnShow.style.display="none"
  }
  if(el.doctorname=="cardiologist") {
    let visitCardiolog= new VisitCardiolog (el.doctor,el.name,el.purpose,el.visitDescription,el.urgency,el.id,el.status,el.doctorname,el.age,el.bloodPressure,el.bmi,el.diseases)   
    visitCardiolog.render()
    let btnShow=document.querySelector(`[data-id ="morebutton${id}"]`)
    btnShow.style.display="none"
  }
  if(el.doctorname=="dentist") {
    let visitDantist= new VisitDantist (el.doctor,el.name,el.purpose,el.visitDescription,el.urgency,el.id,el.status,el.doctorname,el.lastVisit)   
    visitDantist.render()
    let btnShow=document.querySelector(`[data-id ="morebutton${id}"]`)
    btnShow.style.display="none"
  }
  }
  )
  .catch(error => console.log(error))
  }
