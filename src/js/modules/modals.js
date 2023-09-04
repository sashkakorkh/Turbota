import { createElement, setAttributes} from "./functions.js";
import {FormButton} from "./forms.js"



export class Modal {
    constructor(attributes = {}) {
        this.attributes = attributes
    }

    render() {
        //Контейнер модалки
        this.modalContainer = createElement('div');
        for (const [attr, value] of Object.entries(this.attributes)) {
            setAttributes(this.modalContainer, attr, value);
        }
        return this.modalContainer
    }

}


//Кнопка для модалки
export class ModalButton extends FormButton {
    static tagName = 'button';

    constructor(label, attributes = {}) {
        super(attributes);
        this.label = label;
    }
}








