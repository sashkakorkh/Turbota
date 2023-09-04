import {CustomSelect} from "./forms.js";
/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
export function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}
/*============================*/
/*Cоздание элемента*/
/*============================*/


export function createElement (tag) {
	return document.createElement(`${tag}`)
}

/*============================*/
/*Установка аттрибутов*/
/*============================*/

export function setAttributes(element,attribute,value) {
		return  element.setAttribute(`${attribute}`,`${value}`)
}

export function createDiv(...attributes) {
	const div = document.createElement(`div`)
	 div.setAttribute(...attributes)
	return div
}

/*============================*/
/*Создание кастомного селекта*/
/*============================*/

export function creatingSelectObject(selector) {
	const selectElements = document.querySelectorAll(selector);
	let select
	selectElements.forEach(selectElement => {
		select = new CustomSelect(selectElement);
	});
	return select;
}

