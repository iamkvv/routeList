import React, { Component } from 'react'
import { Button } from 'antd';
import RouteList from './routeList'
// import AddRouteList from './addRouteList'
import { getLists, getRoutelist, getUsers, getCompanies } from './bitrixapi'
import { convertRouteListArray } from './helper'

class RouteManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routeListID: 0,
            taskListID: 0,
            addRouteListVisible: false,
            users: [],
            routeListData: []
        }
    }
    // componentDidMount() {
    //     //получить массив списков и выбрать ID МаршЛиста и Заданий
    //     getLists().then(data => {
    //         let routelist = data.result.filter(list => list.NAME === "Маршрутный лист")[0];
    //         let tasklist = data.result.filter(list => list.NAME === "Задания")[0];

    //         if (!routelist || !tasklist) {
    //             alert("Не созданы списки Маршрутных листов или Заданий")
    //         } else {
    //             this.setState({
    //                 routeListID: routelist.ID,
    //                 taskListID: tasklist.ID
    //             });
    //         }
    //     })
    //         .then(() => {//все марш листы
    //             getRoutelist(this.state.routeListID).then(data => {
    //                 this.setState({ routeListData: convertRouteListArray(data.result) })
    //             })
    //         })
    //         .then(data => {
    //             console.log("3 then", data);
    //         })
    //         .catch(error => console.error("ERR getLists", error));


    //     // getCompanies().then(data => {
    //     //   console.log(JSON.stringify(data));
    //     //   this.setState({ companies: data.result });
    //     // })
    //     //   .catch(error => console.error("ERR getCompanies", error));
    // }



    // showAddRouteList_Form = () => {//Открыть форму марш-го листа
    //     getUsers().then(
    //         data => {
    //             if (data.result.length > 0) {
    //                 console.log('USERS -- ', JSON.stringify(data));
    //                 this.setState({
    //                     users: data.result,
    //                     addRouteListVisible: true
    //                 });
    //             }
    //         }
    //     )
    //         .catch(error => console.error("ERR getUsers", error));
    // };

    // onCancelAddRouteList = (form) => {
    //     alert('Cancel');
    //     form.resetFields()
    //     this.setState({ addRouteListVisible: false });
    // }
    // onOKAddRouteList = (data) => {
    //     alert('OK');
    //     console.log("submit OK", data);
    //     console.log("DATE", data.date.format("DD/MM/YYYY"))
    //     this.setState({ addRouteListVisible: false });
    // }

    render() {
        return (
            <div>
                <RouteList />
            </div>

        )
    }
}

export default RouteManager