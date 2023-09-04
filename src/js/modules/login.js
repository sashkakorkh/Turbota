import {Modal} from "./modals.js";
import {logInForm} from "./forms.js";
export let token
import {cardVisit} from "./cardVisit.js";
import {valid} from "./cardVisit.js"

function creatingLoginModal() {
    const place = document.querySelector('header')
    const modal = new Modal({
        class: 'header__login-container modal__container',
    })
    const modalLogin = place.appendChild(modal.render())

    const loginForm = new logInForm('Please, login', {
        class: 'visit-modal modal',
        action: "#",
        method: "post"
    })
    loginForm.render(modalLogin)
    loginForm.close()
    sendLoginData (modalLogin)
    return modalLogin
}


function sendLoginData (modal) {
    const submitButton = document.getElementById('submit-login')

    submitButton.addEventListener('click', async e => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
      const  response = await fetch("https://ajax.test-danit.com/api/v2/cards/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: `${email}`, password: `${password}` })
        })
          if(!response.ok) {
              throw new Error('Cannot login')
          }
          token = await response.text()
        console.log(token)
            modal.remove()
            
            cardVisit(token)
            

            
          

        document.querySelector('.btn__create-visit').style.display="block"
        document.querySelector('.btn__enter').style.display="none"
    })
    

}


export function openLogin() {
    const open = document.querySelector('.btn__enter-text')
    open.addEventListener('click',() => creatingLoginModal().style.display='block')
}


