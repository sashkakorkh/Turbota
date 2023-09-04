import {createElement, setAttributes } from './functions.js'


/*============================*/
/*Form */

/*============================*/

class Form {
    constructor(attributes = {}) {
        this.attributes = attributes;
    }

    render(placeToAppend,modalToClose) {
        this.form = createElement('form');
        // Атрибуты формы
        for (const [attr, value] of Object.entries(this.attributes)) {
            setAttributes(this.form, attr, value);
        }
        placeToAppend.appendChild(this.form);

        //Крестик для закрытия
        this.closeIcon = new closeIcon({
            class: 'modal__close'
        }).render()
        this.form.appendChild(this.closeIcon);
        return this.form;
    }

    close() {
        //Закрытие модалки
            window.addEventListener('click', (e) => {

                if (e.target === this.form.parentElement) this.form.parentElement.style.display = 'none'
            })
        this.closeIcon.addEventListener('click', () => {
        this.form.parentElement.remove()})
    }
}


/*============================*/
/*Form Elements*/

/*============================*/
class Element {
    constructor(attributes = {}) {
        this.attributes = attributes;
    }

    render() {
        const element = createElement(this.constructor.tagName);
        for (const [attr, value] of Object.entries(this.attributes)) {
            setAttributes(element, attr, value);
        }
        return element;
    }
}


class Wrapper extends Element {
    static tagName = 'div'

    constructor(attributes = {}) {
        super(attributes)
    }

}


class Title extends Element {
    static tagName = 'h2';

    constructor(text, attributes = {}) {
        super(attributes);
        this.text = text;
    }

    render() {
        const element = super.render();
        element.innerHTML = this.text;
        return element
    }

}


class Label extends Element {
    static tagName = 'label';

    constructor(text, attributes = {}) {
        super(attributes);
        this.text = text;
    }

    render() {
        const element = super.render();
        element.innerHTML = this.text;
        return element
    }

}


class Input extends Element {
    static tagName = 'input';

    constructor(attributes = {}) {
        super(attributes);
    }
}

export class Select extends Element {
    static tagName = 'select';

    constructor(options = [], attributes = {}) {
        super(attributes);
        this.options = options;

    }

    render() {
        const element = super.render();
        this.options.forEach(option => {
            const optionEl = createElement('option');
            optionEl.value = option.value;
            optionEl.text = option.text;
            element.appendChild(optionEl);
        });
        return element;
    }
}

export class FormButton extends Element {
    static tagName = 'button';

    constructor(label, attributes = {}) {
        super(attributes);
        this.label = label;
    }

    render() {
        const element = super.render();
        element.innerText = this.label;
        return element;
    }
}

class Textarea extends Element {
    static tagName = 'textarea';

    constructor(attributes) {
        super(attributes);

    }
}


class Span extends Element {
    static tagName = 'span'

    constructor(text, attributes) {
        super(attributes);
        this.text = text
    }

    render() {
        const element = super.render();
        element.innerText = this.text;
        return element;
    }
}

 class closeIcon extends Element {
    static tagName = 'span'

    constructor(attributes = {}) {
        super(attributes)
    }

    render() {
        const element = super.render();
        element.innerText = '╳'
        return element;
    }
}

/*============================*/
/*Custom Select*/

/*============================*/

export class CustomSelect {
    constructor(element) {
        this.element = element;
        this.options = getFormattedOptions(element.querySelectorAll('option'));
        this.customElement = createElement('div');
        this.labelElement = createElement('span');
        this.optionsCustomElement = createElement('ul');
        setupCustomElement(this)
        element.style.display = 'none'
        element.after(this.customElement)
    }

    get selectedOption() {
        return this.options.find(option => option.selected)

    }

    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption)
    }

    selectValue(value) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value
        })
        const prevSelectedOption = this.selectedOption
        prevSelectedOption.selected = false
        prevSelectedOption.element.selected = false

        newSelectedOption.selected = true
        newSelectedOption.element.selected = true

        this.labelElement.innerText = newSelectedOption.label
        this.optionsCustomElement.querySelector(`[data-value='${prevSelectedOption.value}']`)
            .classList.remove('selected')
        const newCustomElement = this.optionsCustomElement.querySelector(`[data-value='${newSelectedOption.value}']`)
        newCustomElement.classList.add('selected')
        newCustomElement.scrollIntoView({block: 'nearest'})
    }
}

function setupCustomElement(select) {
    select.customElement.classList.add('custom-select-container')
    select.customElement.tabIndex = 0

    select.labelElement.classList.add('custom-select-value')
    select.labelElement.innerText = select.selectedOption.label
    select.customElement.append(select.labelElement)

    select.optionsCustomElement.classList.add('custom-select-options')
    select.options.forEach(option => {
        const optionElement = createElement('li')
        optionElement.classList.add('custom-select-option')
        optionElement.classList.toggle(`selected`, option.selected)
        optionElement.innerText = option.label
        optionElement.dataset.value = option.value
        optionElement.addEventListener('click', () => {
            select.selectValue(option.value)
            select.optionsCustomElement.classList.remove('show')
        })
        select.optionsCustomElement.append(optionElement)
    })
    select.customElement.append(select.optionsCustomElement)

    select.labelElement.addEventListener('click', () => {
        select.optionsCustomElement.classList.toggle('show')
    })

    select.customElement.addEventListener('blur', () => {
        select.optionsCustomElement.classList.remove('show')
    })

    let debounceTimeout
    let searchTerm = ''

    select.customElement.addEventListener('keydown', e => {
        switch (e.code) {
            case 'Space':
                select.optionsCustomElement.classList.toggle('show')
                break
            case 'ArrowUp': {
                const prevOption = select.options[select.selectedOptionIndex - 1]
                if (prevOption) {
                    select.selectValue(prevOption.value)
                }
                break
            }
            case 'ArrowDown': {
                const nextOption = select.options[select.selectedOptionIndex + 1]
                if (nextOption) {
                    select.selectValue(nextOption.value)
                }
                break
            }
            case 'Enter':
            case 'Escape':
                select.optionsCustomElement.classList.remove('show')
                break
            default: {
                clearTimeout(debounceTimeout)
                searchTerm += e.key
                debounceTimeout = setTimeout(() => {
                    searchTerm = ''
                }, 500)

                const searchedOption = select.options.find(option => {
                    return option.label.toLowerCase().startsWith(searchTerm)
                })
                if (searchedOption) {
                    select.selectValue(searchedOption.value)
                }
            }
        }
    })
}


function getFormattedOptions(optionElements) {
    return [...optionElements].map(optionElement => {
        return {
            value: optionElement.value,
            label: optionElement.label,
            selected: optionElement.selected,
            element: optionElement
        }
    })
}


/*==============================================*/

/*LogIn Form*/

/*==============================================*/
export class logInForm extends Form {
    constructor(title, attributes = {}) {
        super(attributes)
        this.title = title

    }

    render(placeToAppend) {
        //Создание формы
        const form = super.render(placeToAppend);
        //wrapper
        const wrap = new Wrapper({
            class: 'login-modal__wrap modal__wrap'
        })
        const wrapEl = form.appendChild(wrap.render())

        //Заголовок
        const title = new Title(this.title, {
            class: 'login-modal__title modal__name'
        })
        wrapEl.appendChild(title.render())

        //Input email
        const inputEmail = new Input({
            class: "input",
            type: "text",
            id: "email",
            placeholder: "Enter Username",
            name: 'uname',
            required: '',
        })
        wrapEl.appendChild(inputEmail.render())


        //Alert email
        const alertEmail = new Span('Correct your email,please', {
            class: "msg hidden"
        })
        wrapEl.appendChild(alertEmail.render())


        //Input password
        const inputPassword = new Input({
            class: "input",
            type: "password",
            id: "password",
            placeholder: "Enter Password",
            name: 'psw',
            required: '',
        })
        wrapEl.appendChild(inputPassword.render())

        //Submit Button
        const submitButton = new FormButton('Submit', {
            class: "btn__submit login-modal__btn-submit",
            type: "submit",
            id: "submit-login"
        })
        wrapEl.appendChild(submitButton.render())
        return form
    }


}


/*==============================================*/

/*Filter Form*/
/*==============================================*/
/*

export class FilterForm extends Form {
    constructor(attributes={}) {
        super(attributes);
        if (!Array.isArray(this.attributes.class)) {
            this.attributes.class = [];
        }
        this.attributes.class.push('filters__form');
    }
    renderForm(placeToAppend) {
        //Создание формы
        const form = super.renderForm(placeToAppend);

        //Цель визита или заголовок
        const inputPurpose = new Input({
            class:"filters__search",
            type:"text",
            placeholder:"title / content of the visit"
        })
        form.appendChild(inputPurpose.render())

        //
    }
    }
*/

/*==============================================*/

/*Visit Form*/

/*==============================================*/
export class VisitForm extends Form {
    constructor(title, attributes = {}) {
        super(attributes);
        if (!Array.isArray(this.attributes.class)) {
            this.attributes.class = [];
        }
        this.attributes.class.push(['modal', 'visit-modal'].join(' '));
        this.title = title
    }

    render(placeToAppend) {
        //Создание формы
        const form = super.render(placeToAppend);
        //wrapper
        const wrap = new Wrapper({
            class: 'visit-modal__wrap modal__wrap'
        })
        const wrapEl = form.appendChild(wrap.render())

        //Заголовок
        const title = new Title(this.title, {
            class: 'visit-modal__title modal__name'
        })
        wrapEl.appendChild(title.render())
        //Выбор врача select
        const labelDoctor = new Label('Choose doctor:', {
            for: "doctor"
        })
        wrapEl.appendChild(labelDoctor.render())
        const selectDoctor = new Select([
            {value:0, text:''},
            {value: 1, text: 'Cardiologist'},
            {value: 2, text: 'Dentist'},
            {value: 3, text: 'Therapist'},

        ], {
            class: 'visit-modal__select-doctor',
            id: 'doctor',
            'data-custom-doctor': '',
            required: ''
        });
        wrapEl.appendChild(selectDoctor.render());

        //Input цель визита
        const labelPurpose = new Label('Purpose of the appointment:', {
            for: "purpose"
        })
        wrapEl.appendChild(labelPurpose.render())
        const inputPurpose = new Input({
            class: "input",
            type: "text",
            id: "purpose",
            required: ''
        })
        wrapEl.appendChild(inputPurpose.render())

        //Textarea для короткого описания визита
        const labelBriefText = new Label('Brief description of the visit:', {
            for: "description"
        })
        wrapEl.appendChild(labelBriefText.render())
        const textBrief = new Textarea({
            class: "input",
            id: "description",
        })
        wrapEl.appendChild(textBrief.render())

        //Select для срочности визита
        const labelUrgency = new Label('Urgency:', {
            for: "urgency"
        })
        wrapEl.appendChild(labelUrgency.render())
        const urgency = new Select([
            {value: 0, text: 'Normal'},
            {value: 1, text: 'Priority'},
            {value: 2, text: 'Emergency'},

        ], {
            class: 'visit-modal__urgency-options',
            id: 'urgency',
            'data-custom-urgency': '',
            required: ''
        });
        wrapEl.appendChild(urgency.render());

        //Input для имени
        const labelName = new Label('First Name and Last Name:', {
            for: "patient-name"
        })
        wrapEl.appendChild(labelName.render())
        const inputName = new Input({
            class: "input",
            type: "text",
            id: "patient-name",
            required: ''
        })
        wrapEl.appendChild(inputName.render())

        //Button Submit
        const submitButton = new FormButton('Submit Visit', {
            class: "btn__search",
            type: "submit",
            id: "submit-card-btn"
        })
        wrapEl.appendChild(submitButton.render())
        return form;
    }
}

export class VisitCardiologistField {
    constructor() {
        this.name = 'cardiologist'
    }

    render() {
        const doctorFieldWrap = new Wrapper({
            class: "visit-modal__cardiologist-options doctor-field",
            'data-value': "0",
            id: 'cardiologist-field'

        })
        const doctorField = doctorFieldWrap.render()
        //
        const labelPressure = new Label('Normal blood pressure:', {
            for: "blood-pressure"
        })
        doctorField.append(labelPressure.render())
        const inputPressure = new Input({
            class: "input",
            type: "text",
            id: "blood-pressure",
            required: ''
        })
        doctorField.append(inputPressure.render())
        //
        const labelBmi = new Label('Body mass index:', {
            for: "bmi"
        })
        doctorField.append(labelBmi.render())
        const inputBmi = new Input({
            class: "input",
            type: "text",
            id: "bmi",
            required: ''
        })
        doctorField.append(inputBmi.render())

        //
        const labelDisease = new Label('Transferred diseases of the cardiovascular system:', {
            for: "cardio-diseases"
        })
        doctorField.append(labelDisease.render())
        const inputDisease = new Input({
            class: "input",
            type: "text",
            id: "cardio-diseases",
            required: ''
        })
        doctorField.append(inputDisease.render())


        //
        const labelAge = new Label('Age:', {
            for: "age-in-cardiologist"
        })
        doctorField.append(labelAge.render())
        const inputAge = new Input({
            class: "input",
            type: "text",
            id: "age-in-cardiologist",
            required: ''
        })
        doctorField.appendChild(inputAge.render())
        return doctorField

    }

}


export class VisitDentistsField {
    constructor() {
        this.name = 'dentist'
    }

    render() {
        const doctorFieldWrap = new Wrapper({
            class: "visit-modal__dentist-options doctor-field",
            'data-value': "0",
            id: 'dentist-field'
        })
        const doctorField = doctorFieldWrap.render()
        const labelLastVisit = new Label('Date of the last visit:', {
            for: "last-visit"
        })
        doctorField.appendChild(labelLastVisit.render())
        const inputLastVisit = new Input({
            class: "input",
            type: "text",
            id: "last-visit",
            required: ''
        })
        doctorField.appendChild(inputLastVisit.render())
        return doctorField
    }
}


export class VisitTherapistField {
    constructor() {
        this.name = 'therapist'
    }

    render() {
        const doctorFieldWrap = new Wrapper({
            class: "visit-modal__therapist-options doctor-field",
            'data-value': "0",
            id: 'therapist-field'
        })
        const doctorField = doctorFieldWrap.render()
        const labelAge = new Label('Age:', {
            for: "age-in-therapist"
        })
        doctorField.appendChild(labelAge.render())
        const inputAge = new Input({
            class: "input",
            type: "text",
            id: "age-in-therapist",
            required: ''
        })
        doctorField.appendChild(inputAge.render())
        return doctorField
    }
}


/*
export class EditForm extends VisitForm {
    constructor(attributes){
        super(attributes)
    }
    render(placeToAppend) {
        const form = super.render(placeToAppend);
        const status = new Select([
            {value: 0, text: 'Open'},
            {value: 1, text: 'Done'},

        ], {
            class: 'edit-modal__status-options',
            id: 'status-edit',
            'data-custom-urgency': '',
            required: ''
        });
        form.appendChild(status.render())
    }

}
*/


