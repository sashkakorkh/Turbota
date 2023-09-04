import {token} from './login.js'
import {Modal} from "./modals.js";
import {Select, VisitForm} from "./forms.js";
import {creatingSelectObject} from "./functions.js";
import {renderDoctorInputs,fetchVisitCard} from "./creatingVisit.js";
import {cardVisit} from "./cardVisit.js";

export async function editCard(token, cardId) {
    try {
        const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if (!response.ok) {
            throw new Error('Cannot get card')
        }
        let result = await response.json()

        const place = document.querySelector('header')
        //Модалка
        console.log(result)
        const modal = new Modal({
            class: 'header__edit-visit-modal modal__container',
        })
        const modalVisit = place.appendChild(modal.render())
        const visitForm = new VisitForm('Edit visit', {
            class: 'edit-visit-modal modal',
            action: "#",
            method: "put"
        })
        const statusSelect = new Select([
            {value: 0, text: 'Open'},
            {value: 1, text: 'Done'},

        ], {
            class: 'edit-modal__status-options',
            id: 'status-edit',
            'data-custom-status': '',
            required: ''
        });
        //Форма
        visitForm.render(modalVisit)
        //Open/Done select
        const btnSubmit = document.querySelector('#submit-card-btn')
        btnSubmit.before(statusSelect.render())
        visitForm.close()
        creatingSelectObject('[data-custom-doctor]')
        creatingSelectObject('[data-custom-urgency]')
        creatingSelectObject('[data-custom-status]')
        const selectedDocName = result.doctorname
        //Установка значения для селекта  doctor
        const selectDoctor = document.querySelector('[data-custom-doctor]')
        const customSelectDiv = selectDoctor.nextSibling
        const doctorNames = customSelectDiv.lastChild.children
        const label = customSelectDiv.firstChild
        for (let i = 0; i < doctorNames.length; i++) {
            const liElement = doctorNames[i];
            if (liElement.outerText.toLowerCase() === selectedDocName) {
                liElement.classList.add('selected')
                let labelText = `${selectedDocName}`
                labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
                label.innerText = `${labelText}`
            } else {
                liElement.classList.remove('selected')
            }
        }
        renderDoctorInputs()
        if(selectedDocName === 'cardiologist') {
            const bloodPressure = document.querySelector('#blood-pressure')
            bloodPressure.value = `${result.bloodPressure}`
            const bmi = document.querySelector('#bmi')
            bmi.value = `${result.bmi}`
            const diseases = document.querySelector('#cardio-diseases')
            diseases.value = `${result.diseases}`
            const ageIncardio = document.querySelector('#age-in-cardiologist')
            ageIncardio.value = `${result.age}`
        }
        console.log(selectedDocName === 'dentist')
        if(selectedDocName === 'dentist') {
            const lastVisit = document.querySelector('#last-visit')
            lastVisit.value = `${result.lastVisit}`
        }
        if(selectedDocName === 'therapist') {
            const ageInTherapist = document.querySelector('#age-in-cardiologist')
            ageInTherapist.value=`${result.ageInTherapist}`
        }
        const purpose = document.querySelector('#purpose')
        purpose.value = `${result.purpose}`

        const description = document.querySelector('#description')
        description.value = `${result.visitDescription}`

        const patientName = document.querySelector('#patient-name')
        patientName.value = `${result.name}`

        //Установка значения для селекта  urgency
        const selectUrgency = document.querySelector('[data-custom-urgency]')
        const selectedUrgencyName = result.urgency
        const customUrgencyDiv = selectUrgency.nextSibling
        const urgencyNames = customUrgencyDiv.lastChild.children
        const labelUrgency = customUrgencyDiv.firstChild
        for (let i = 0; i < urgencyNames.length; i++) {
            const liElement = urgencyNames[i];
            console.log(selectedUrgencyName)
            if (liElement.outerText.toLowerCase() === selectedUrgencyName.toLowerCase()) {

                liElement.classList.add('selected')
                let labelText = `${selectedUrgencyName}`
                labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
                labelUrgency.innerText = `${labelText}`
            } else {
                liElement.classList.remove('selected')
            }
        }

        //Установка значения для селекта status
        const selectStatus = document.querySelector('[data-custom-status]')
        const selectedStatusName = result.status
        const customStatusDiv = selectStatus.nextSibling
        const statusNames = customStatusDiv.lastChild.children
        const labelStatus = customStatusDiv.firstChild

        for (let i = 0; i < statusNames.length; i++) {
            const liElement = statusNames[i];
            if (liElement.outerText.toLowerCase() === selectedStatusName) {
                liElement.classList.add('selected')
                let labelText = `${selectedStatusName}`
                labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
                labelStatus.value = `${labelText}`
            } else {
                liElement.classList.remove('selected')
            }
        }
        modalVisit.style.display = 'block'
        fetchEditedCard(token,modalVisit,cardId)
    } catch
        (err) {
        alert(err.message)
    }
}

function fetchEditedCard(token,modal,cardId) {
    const submitBtn = document.querySelector('#submit-card-btn')
    try {
        submitBtn.addEventListener('click', async e => {
            e.preventDefault()
            const patientName = document.querySelector('#patient-name').value
            const visitPurpose = document.querySelector('#purpose').value
            const visitDescription = document.querySelector('#description').value
            const urgency = document.querySelector('[data-custom-urgency]')
            const selectedUrgency = urgency.nextElementSibling.querySelector('.selected').outerText
            console.log(selectedUrgency)
            e.preventDefault()
            
            setTimeout(cardVisit,1000,token)
            if (document.querySelector('#cardiologist-field')) {
                const bloodPressure = document.querySelector('#blood-pressure').value
                const bmi = document.querySelector('#bmi').value
                const diseases = document.querySelector('#cardio-diseases').value
                const ageInCardio = document.querySelector('#age-in-cardiologist').value
                const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id:`${cardId}`,
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
                return result
            }
            if(document.querySelector('#dentist-field')) {
                const lastVisit = document.querySelector('#last-visit').value
                const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        doctor: 'Appointment with the dentist',
                        id:`${cardId}`,
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
                return result
            }
            if(document.querySelector('#therapist-field')) {
                const ageInTherapist = document.querySelector('#age-in-therapist').value
                const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id:`${cardId}`,
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
                console.log(result)
                return result
            }

        })
    } catch (err) {
        alert(err.message)
    }
}



