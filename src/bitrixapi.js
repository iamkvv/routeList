//import { config } from './App'//  './config.json'
import React, { Component } from 'react'

function handleErrors(response) {
    if (!response.ok) {
        console.log(response)
        throw Error(response.statusText);
    }
    return response;
}

function checkAuth() {
    return new Promise((resolve, reject) => {

        if (window.BX24) {
            let a = BX24.getAuth();
            let conf = {
                domain: a.domain,
                token: a.access_token
            }
            resolve(conf)
        } else {
            let conf = {
                domain: "anywhere.bitrix24.ru",
                token: 'd6f42d5e0043ea4c0031392000000001201c034f9f3cc8ed77056590c906bf0fda8e08'
            }
            //setTimeout(() => resolve(conf), 300);
            resolve(conf)
        }
    })
    //    return promAuth;
}

//все списки в портале для проверки
function getLists() {
    return checkAuth()
        .then((config) => {
            let addr = "rest/lists.get";
            let params = "&IBLOCK_TYPE_ID=lists"
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`

            return fetch(request, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json());
        })
}

//все записи маршрутных листов
function getRoutelist(iblockid) {
    return checkAuth()
        .then((config) => {
            let addr = "rest/lists.element.get";
            let params = `&IBLOCK_TYPE_ID=lists&IBLOCK_ID=${iblockid}`; //д.б. 60
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`

            return fetch(request, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}

//Добавление Марш листа
function addRoutelist(iblockid, user_id, fio, date, comment) {
    return checkAuth()
        .then((config) => {
            let addr = "rest/lists.element.add";
            let params = `&fields[NAME]=${date}-${fio}&fields[PROPERTY_228]=${user_id}&fields[PROPERTY_230]=${fio}&fields[PROPERTY_232]=${date}&fields[PROPERTY_234]=${comment}&IBLOCK_TYPE_ID=lists&IBLOCK_ID=${iblockid}&ELEMENT_CODE=${new Date().getTime()}`;
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`
            return fetch(request, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}

//Добавление задания в список
function addTasklist(iblockid, fk, date, user_id, fio, comp_id, comp, gis, phone, task, address) {
    return checkAuth()
        .then((config) => {
            let addr = "rest/lists.element.add";
            let tsk = task.replace(/\n/g, "<br>") // проверить!!!
            let params = `&fields[NAME]=МЛ-${fk}&fields[PROPERTY_236]=${fk}&fields[PROPERTY_238]=${date}&fields[PROPERTY_240]=${user_id}&fields[PROPERTY_242]=${fio}&fields[PROPERTY_244]=${comp_id}&fields[PROPERTY_248]=${comp}&fields[PROPERTY_250]=${gis}&fields[PROPERTY_252]=${phone}&fields[PROPERTY_254]=${tsk}&fields[PROPERTY_256]=${address}&IBLOCK_TYPE_ID=lists&IBLOCK_ID=${iblockid}&ELEMENT_CODE=${new Date().getTime()}`
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`
            return fetch(request, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}

//Удаление задания из списка
function deleteTasklist(iblockid, elementid) {
    return checkAuth()
        .then((config) => {
            let addr = "rest/lists.element.delete";
            let params = `&IBLOCK_TYPE_ID=lists&IBLOCK_ID=${iblockid}&ELEMENT_ID=${elementid}`
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`
            return fetch(request, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}

//Задания по ID марш. листа
function getTasksBykey(iblockid, fk) {
    return checkAuth()
        .then((config) => {
            let addr = "rest/lists.element.get";
            let params = `&filter[PROPERTY_236]=${fk}&IBLOCK_TYPE_ID=lists&IBLOCK_ID=${iblockid}`
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`;

            return fetch(request, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}


//все сотрудники
function getUsers() {
    return checkAuth()
        .then((config) => {
            let addr = "rest/user.get";
            let request = `https://${config.domain}/${addr}?auth=${config.token}`

            return fetch(request, {
                method: 'GET',
                mode: 'cors', // no-cors, cors, *same-origin
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}

//все компании  !!Сделать для больших списков 
function getCompanies() {
    return checkAuth()
        .then((config) => {
            let addr = "rest/crm.company.list";
            let params = "&select[]=ID&select[]=TITLE&select[]=PHONE&select[]=UF_CRM_1579113190&select[]=UF_CRM_5E1D86B235DB7"
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`

            return fetch(request, {
                method: 'POST',
                mode: 'cors', // no-cors, cors, *same-origin
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}

//Создает задачу !!Проверить <BR>
function addTask(title, resp_id, task, gis, company_id) {
    return checkAuth()
        .then((config) => {
            let tsk = task.replace(/\n/g, "<br>")
            tsk = tsk.replace(/\r\n/g, "<br>")
            let content = tsk + "<br>" + "Открыть 2GIS: " + gis;
            let addr = "rest/tasks.task.add";
            let company = 'fields[UF_CRM_TASK][0]=CO_' + company_id;
            let params = `&fields[RESPONSIBLE_ID]=${resp_id}&fields[TITLE]=${title}&fields[DESCRIPTION]=${content}&${company}`
            let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`;

            return fetch(request, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(handleErrors)
                .then(response => response.json())
        })
}

export {
    getLists,
    addRoutelist,
    getRoutelist,
    getUsers,
    getCompanies,
    addTasklist,
    getTasksBykey,
    addTask,
    deleteTasklist
};