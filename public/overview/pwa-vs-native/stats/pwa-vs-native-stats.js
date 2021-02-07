
"use strict";

const nativeList = document.querySelector('#native-list');
const mobileList = document.querySelector('#mobile-list');
const button = document.querySelector('#action-button');

const appendListItems = (textList, listElement, side = 'Right') => {
  textList.forEach(text => {
    const entry = document.createElement('li');
    entry.appendChild(document.createTextNode(text));
    entry.classList.add('animate__animated', `animate__slideIn${side}`);
    listElement.appendChild(entry);
  });
}

const removeElement = (element, side = 'Right') => {
  element.classList.add('animate__animated', `animate__slideOut${side}`);
}

const changeLists = () => {
  appendListItems(["80% of time spent in user's top 3 apps", 'Average of ~0 apps installed monthly','3.3 million daily users' ], nativeList, 'Left');
  appendListItems(['','','88 million daily users'], mobileList, 'Right');
  removeElement(button, "Left")
}

