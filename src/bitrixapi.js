import config from './config.json'
import React, { Component } from 'react'



function auth() {
    if (window.BX24) {
        window.BX24.init(function () {

            config.domain = BX24.getAuth().domain;
            config.token = BX24.getAuth().access_token;

            // console.log("B24 from module 1", BX24.getAuth());
            console.log("B24 from module config", config);

        });
    }
}



//все списки
function getLists() {
    auth();
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
        .then(response => response.json());
}

//все записи маршрутных листов
function getRoutelist(iblockid) {
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
        .then(response => response.json());
}

//Добавление Марш листа
function addRoutelist(iblockid, user_id, fio, date, comment) {
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
        .then(response => response.json());
}

//Добавление задания в список
function addTasklist(iblockid, fk, date, user_id, fio, comp_id, comp, gis, phone, task, address) {
    let addr = "rest/lists.element.add";
    debugger;
    let tsk = task.replace(/\n/g, "<br>")
    let params = `&fields[NAME]=МЛ-${fk}&fields[PROPERTY_236]=${fk}&fields[PROPERTY_238]=${date}&fields[PROPERTY_240]=${user_id}&fields[PROPERTY_242]=${fio}&fields[PROPERTY_244]=${comp_id}&fields[PROPERTY_248]=${comp}&fields[PROPERTY_250]=${gis}&fields[PROPERTY_252]=${phone}&fields[PROPERTY_254]=${tsk}&fields[PROPERTY_256]=${address}&IBLOCK_TYPE_ID=lists&IBLOCK_ID=${iblockid}&ELEMENT_CODE=${new Date().getTime()}`

    let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`
    return fetch(request, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json());
}

//
function getTasksBykey(iblockid, fk) {
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
        .then(response => response.json());
}


//все сотрудники
function getUsers() {
    let addr = "rest/user.get";
    let params = ""
    let request = `https://${config.domain}/${addr}?auth=${config.token}`

    return fetch(request, {
        method: 'GET',
        mode: 'cors', // no-cors, cors, *same-origin
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json());
}

//все компании
function getCompanies() {
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
        .then(response => response.json());
}


function addTask(title, resp_id, task, gis) {
    //let content = "<p>" + task + "</p>" + "<p>" + gis + "</p>";
    let tsk = task.replace(/\n/g, "<br>")
    tsk = tsk.replace(/\r\n/g, "<br>")

    let content = tsk + "<br>" + gis;

    debugger;
    //String.fromCharCode(13) + String.fromCharCode(10)
    console.log(content)

    let addr = "rest/tasks.task.add";
    let params = `&fields[RESPONSIBLE_ID]=${resp_id}&fields[TITLE]=${title}&fields[DESCRIPTION]=${content}`
    //debugger
    let request = `https://${config.domain}/${addr}?auth=${config.token}${params}`;

    return fetch(request, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json());
}

export {
    getLists,
    addRoutelist,
    getRoutelist,
    getUsers,
    getCompanies,
    addTasklist,
    getTasksBykey,
    addTask
};