import React from 'react'
import { Divider } from 'antd';

//Преобразует массив маршрутных листов из Б24 в форму, удобную для показа в таблице
function convertRouteListArray(bxarr) {

    let narr = bxarr.map(ml => (
        Object.assign({}, {
            ID: ml.ID,
            NAME: ml.NAME,
            USER_ID: ml.PROPERTY_228[Object.keys(ml.PROPERTY_228)[0]],
            FIO: ml.PROPERTY_230[Object.keys(ml.PROPERTY_230)[0]],
            DATE: ml.PROPERTY_232[Object.keys(ml.PROPERTY_232)[0]],
            COMMENT: ml.PROPERTY_234[Object.keys(ml.PROPERTY_234)[0]]
        })
    ))
    return narr;

}

function convertTaskArray(bxarr) {

    let narr = bxarr.map(tsk => (
        Object.assign({}, {
            ID: tsk.ID,
            NAME: tsk.NAME,
            FK: tsk.PROPERTY_236[Object.keys(tsk.PROPERTY_236)[0]],
            DATE: tsk.PROPERTY_238[Object.keys(tsk.PROPERTY_238)[0]],
            USER_ID: tsk.PROPERTY_240[Object.keys(tsk.PROPERTY_240)[0]],
            FIO: tsk.PROPERTY_242[Object.keys(tsk.PROPERTY_242)[0]],
            COMPANY_ID: tsk.PROPERTY_244[Object.keys(tsk.PROPERTY_244)[0]],
            COMPANY: tsk.PROPERTY_248[Object.keys(tsk.PROPERTY_248)[0]],
            GIS: tsk.PROPERTY_250[Object.keys(tsk.PROPERTY_250)[0]],
            TEL: tsk.PROPERTY_252[Object.keys(tsk.PROPERTY_252)[0]],
            TASK: tsk.PROPERTY_254[Object.keys(tsk.PROPERTY_254)[0]],
            ADDRESS: tsk.PROPERTY_256[Object.keys(tsk.PROPERTY_256)[0]]
        })
    ))
    console.log(narr)
    return narr;

}

const columns = [
    {
        title: 'ID',
        dataIndex: 'ID',
        key: 'id',
        render: text => <b> {text}</b>,
    },
    {
        title: 'Дата',
        dataIndex: 'DATE',
        key: 'date',
        // render: text => <span> {text}</span>,
    },
    {
        title: 'ФИО',
        dataIndex: 'FIO',
        key: 'fio',
        // render: text => <p>{text} </p>,
    },

    {
        title: 'Комментрии',
        dataIndex: 'COMMENT',
        key: 'comment',
        // render: text => (<p> {text}</p>),
    },

    {
        title: 'Действия',
        key: 'action',
        render: (text, record) => (
            <span>
                <a>Изменить</a>
                <Divider type="vertical" />
                <a>Удалить</a>
            </span>
        ),
    }
];

const taskColumns = [
    {
        title: 'ID',
        dataIndex: 'ID',
        key: 'id',
    },
    {
        title: 'Дата',
        dataIndex: 'DATE',
        key: 'date',
    },

    {
        title: 'ФИО',
        dataIndex: 'FIO',
        key: 'fio',
    },
    {
        title: 'Компания',
        dataIndex: 'COMPANY',
        key: 'company',
    },
    {
        title: 'Адрес',
        dataIndex: 'ADDRESS',
        key: 'address',
        render: text => <p> {text}</p>
    },

    {
        title: 'Действия',
        key: 'action',
        render: (text, record) => (
            <span>
                <a>Изменить</a>
                <Divider type="vertical" />
                <a>Удалить</a>
            </span>
        ),
    }

    // {
    //     title: 'Задание',
    //     dataIndex: 'TASK',
    //     key: 'task',
    // },
]

export { convertRouteListArray, convertTaskArray, columns, taskColumns }