import {VisitCardiologistField, VisitDentistsField, VisitForm, VisitTherapistField} from "./forms.js";
import {creatingSelectObject} from "./functions.js";
import {Modal} from './modals.js'
import {token} from './login.js'
import {cardVisit} from './cardVisit.js'
import {visitContainer} from './cardVisit.js'
import { Visit } from "./cardVisit.js";
function creatingVisitModal() {
    const open = document.querySelector('.btn__create-visit')
    const place = document.querySelector('header')
    //Модалка
    const modal = new Modal({
        class: 'header__visit-modal modal__container',
    })
    const modalVisit = place.appendChild(modal.render())
    const visitForm = new VisitForm('Creating visit', {
        class: 'visit-modal modal',
        action: "#",
        method: "post"
    })
    //Форма
    visitForm.render(modalVisit)
    visitForm.close()
    creatingSelectObject('[data-custom-doctor]')
    creatingSelectObject('[data-custom-urgency]')
    fetchVisitCard(token, modalVisit)
    return modalVisit
}


export function openVisitModal() {
    const open = document.querySelector('.btn__create-visit')
    open.addEventListener('click', () => {
        creatingVisitModal().style.display = 'block'
        selectDoctorOptions()

    })
}

//Селект для доктора и рендер доп.инпутов
export function selectDoctorOptions() {
    document.querySelector('[data-custom-doctor]').nextElementSibling.addEventListener('click', (e) => {
        renderDoctorInputs ()

    })
}

//рендер доп.инпутов

export function renderDoctorInputs () {
    const selectDoctor = document.querySelector('[data-custom-doctor]')
    const selectedDoctorName = selectDoctor.nextElementSibling.querySelector('.selected')
    const cardiologist = new VisitCardiologistField()
    const dentist = new VisitDentistsField()
    const therapist = new VisitTherapistField()
    const doctorFields = [cardiologist, dentist, therapist]
    const customContainer = selectDoctor.nextElementSibling
    const docField = document.querySelector('.doctor-field')
    if (selectedDoctorName.outerText === '') {
        return
    }
    if (selectedDoctorName) {
        if (docField) {
            docField.remove()
        }
        const selectedField = doctorFields.find(field => field.name === selectedDoctorName.outerText.toLowerCase())
        customContainer.after(selectedField.render())
    }
}







//Отправка карточки на сервер
export function fetchVisitCard(token,modal) {
    const submitBtn = document.querySelector('#submit-card-btn')
    try {
        submitBtn.addEventListener('click', async e => {
            
           
            // setTimeout(cardVisit,1000,token)
            e.preventDefault()
            const patientName = document.querySelector('#patient-name').value
            const visitPurpose = document.querySelector('#purpose').value
            const visitDescription = document.querySelector('#description').value
            const urgency = document.querySelector('[data-custom-urgency]')
            const selectedUrgency = urgency.nextElementSibling.querySelector('.selected').outerText

           
            e.preventDefault()

            if (document.querySelector('#cardiologist-field')) {
                const bloodPressure = document.querySelector('#blood-pressure').value
                const bmi = document.querySelector('#bmi').value
                const diseases = document.querySelector('#cardio-diseases').value
                const ageInCardio = document.querySelector('#age-in-cardiologist').value


                const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        doctor: 'Appointment with the cardiologist',
                        doctorname:'cardiologist',
                        name: `${patientName}`,
                        age: `${ageInCardio}`,
                        bloodPressure : `${bloodPressure}`,
                        bmi: `${bmi}`,
                        diseases: `${diseases}`,
                        purpose: `${visitPurpose}`,
                        visitDescription: `${visitDescription}`,
                        urgency: `${selectedUrgency}`,
                        status:'open'
                    })
                })
                if (!response.ok) {
                    throw new Error('Cannot send card')
                }
                let result = await response.json()
                console.log(result)
                modal.remove()
                let visit= new Visit("",`${patientName}`,`${visitPurpose}`,`${visitDescription}`,`${selectedUrgency}`,`${result.id}`,"open","cardiologist")
                visit.render()
                return result
            }
            if(document.querySelector('#dentist-field')) {
                const lastVisit = document.querySelector('#last-visit').value
                const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        doctor: 'Appointment with the dentist',
                        doctorname:'dentist',
                        name: `${patientName}`,
                        lastVisit: `${lastVisit}`,
                        purpose: `${visitPurpose}`,
                        visitDescription: `${visitDescription}`,
                        urgency: `${selectedUrgency}`,
                        status:'open'
                    })
                })

                if (!response.ok) {
                    throw new Error('Cannot send card')
                }
                let result = await response.json()
                console.log(result)
                modal.remove()
                let visit= new Visit("",`${patientName}`,`${visitPurpose}`,`${visitDescription}`,`${selectedUrgency}`,`${result.id}`,"open","dentist")
                visit.render()
                return result
            }
            if(document.querySelector('#therapist-field')) {
                const ageInTherapist = document.querySelector('#age-in-therapist').value
                const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        doctor: 'Appointment with the therapist',
                        doctorname:'therapist',
                        name: `${patientName}`,
                        ageInTherapist: `${ageInTherapist}`,
                        purpose: `${visitPurpose}`,
                        visitDescription: `${visitDescription}`,
                        urgency: `${selectedUrgency}`,
                        status:'open'
                    })
                })
                if (!response.ok) {
                    throw new Error('Cannot send card')
                }
                let result = await response.json()
                modal.remove()
                let visit= new Visit("",`${patientName}`,`${visitPurpose}`,`${visitDescription}`,`${selectedUrgency}`,`${result.id}`,"open","therapist")
                visit.render()
                
                return result
            }
           
        })
    
    } catch (err) {
        alert(err.message)
    }
}
