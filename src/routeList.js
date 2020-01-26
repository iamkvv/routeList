import React, { Component } from 'react'
import { Button, Table, Row, Col, Divider } from 'antd';
import AddRouteList from './addRouteList'
import AddTask from './addTask'
import { getLists, addRoutelist, getRoutelist, getUsers, getCompanies, addTasklist, getTasksBykey } from './bitrixapi'
import { convertRouteListArray, convertTaskArray, columns, taskColumns } from './helper'

import { BuildTasks } from './buildsTasks'
import DeleteTaskFromList from './deleteTaskList'

const ButtonGroup = Button.Group;

class RouteList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRowIndex: 0,//индекс выбранного по click марш. листа (для подстветки) 
            routeListID: 0,
            taskListID: 0,
            addRouteListVisible: false,
            addTaskVisible: false,
            selectedRowKeys: [],
            routeListData: [],
            companies: [],
            users: [],
            selectedRouteList: {},
            tasksByRouteList: [],
            showDeleteTaskListDialog: false, //Показ диалога удаления марш. листа
            taskListforDelete: {} // удаляемая запись марш. листа
        }
    }

    componentDidMount() {
        //получить массив списков и выбрать ID МаршЛиста и Заданий
        getLists().then(data => {
            let routelist = data.result.filter(list => list.NAME === "Маршрутный лист")[0];
            let tasklist = data.result.filter(list => list.NAME === "Задания")[0];

            if (!routelist || !tasklist) {
                alert("Не созданы списки Маршрутных листов или Заданий")
            } else {
                this.setState({
                    routeListID: routelist.ID,
                    taskListID: tasklist.ID
                });
            }
        })
            .then(() => {//все марш листы
                getRoutelist(this.state.routeListID).then(data => {

                    if (data.result.length > 0) {
                        this.setState({ routeListData: convertRouteListArray(data.result) });
                    } else { return }
                }).then(() => {//задания по первому марш. листу
                    if (this.state.routeListData.length > 0) {
                        this.setState({ selectedRouteList: this.state.routeListData[0] });
                        console.log("after get routesList", this.state.routeListData[0]);
                    }
                }).then(() => {//получить связанные задачи
                    if (this.state.routeListData.length > 0) {
                        getTasksBykey(this.state.taskListID, this.state.selectedRouteList.ID).then((data) => {
                            console.log("tasks by key ", data);
                            if (data.result.length > 0) {
                                let convertedTaskArray = convertTaskArray(data.result);
                                this.setState(
                                    {
                                        tasksByRouteList: convertedTaskArray
                                    },
                                    this.props.setRouteListTasks(convertedTaskArray)//задания 1-го листа - в state App
                                );
                            }
                        })
                    }
                })
            })
            .catch(error => console.error("Ошибка в getLists", error));
    }

    showAddTask_Form = () => {
        getCompanies().then(data => {
            if (data.result.length > 0) {
                console.log('COMPS -- ', JSON.stringify(data));
                this.setState({
                    companies: data.result,
                    addTaskVisible: true
                });
            }
        })
    }

    //сохраниться и обновиться
    onOKAddTask = (data, form) => {
        form.resetFields();
        var self = this;
        //Добавить задачу в список "Задания"
        addTasklist(this.state.taskListID,
            this.state.selectedRouteList.ID,
            this.state.selectedRouteList.DATE,
            this.state.selectedRouteList.USER_ID,
            this.state.selectedRouteList.FIO,
            data.company.ID,
            data.company.TITLE,
            data.company.UF_CRM_1579113190, //gis
            data.company.PHONE[0].VALUE,
            data.task,
            data.company.UF_CRM_5E1D86B235DB7, //address
        )
            .then(data => {
                getTasksBykey(this.state.taskListID, this.state.selectedRouteList.ID).then((data) => {
                    self.props.setRouteListTasks(convertTaskArray(data.result));

                    this.setState({
                        tasksByRouteList: convertTaskArray(data.result),
                        addTaskVisible: false
                    });
                })
            })
    }

    showAddRouteList_Form = () => {//Открыть форму добавления марш-го листа
        getUsers().then(
            data => {
                if (data.result.length > 0) {
                    console.log('USERS -- ', JSON.stringify(data));
                    this.setState({
                        users: data.result,
                        addRouteListVisible: true
                    });
                }
            }
        )
            .catch(error => console.error("ERR getUsers", error));
    };

    onCancelAddRouteList = (form) => {
        form.resetFields();
        this.setState({ addRouteListVisible: false });
    }

    onCancelAddTask = (form) => {
        form.resetFields();
        this.setState({ addTaskVisible: false });
    }

    //сохраниться и обновиться
    onOKAddRouteList = (data, form) => {

        console.log("submit OK", data);

        form.resetFields();

        addRoutelist(this.state.routeListID,
            data.user.ID,
            data.user.LAST_NAME + ' ' + data.user.NAME,
            data.date,
            data.comment)
            .then(data => {
                console.log("onOKAddRouteList", data);
                //Обновляемся
                getRoutelist(this.state.routeListID).then(data => {
                    this.setState({ routeListData: convertRouteListArray(data.result) })
                }).then(() => {
                    console.log("after get routesList", this.state.routeListData[0])
                })

            })
            .catch(err => { console.log("err onOKAddRouteList", err) })

        this.setState({ addRouteListVisible: false });
    }


    onClickDeleteRouteList = (e) => {
        console.log('onDelete', e)
    }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    //создает задачи из списка заданий
    buildTasks = () => {
        const buildtasks = BuildTasks(this.state.tasksByRouteList);
        buildtasks();
    }

    hideDeleteTaskListDialog = () => {
        this.setState(
            { showDeleteTaskListDialog: false }
        )
    }

    //!!!
    GetTasksByKey = (routeListId) => {
        let self = this;
        document.body.style.cursor = "progress"; //??
        getTasksBykey(this.state.taskListID, routeListId)
            .then((data) => {
                console.log("tasks by key ", data);
                //передаем полученные задания в App для последующей передачи в Yandex
                let convertedData = convertTaskArray(data.result);
                self.props.setRouteListTasks(convertedData);

                self.setState({
                    tasksByRouteList: convertedData
                });
                document.body.style.cursor = "";
            })
    }

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <AddRouteList
                            visible={this.state.addRouteListVisible}
                            users={this.state.users}
                            onCancel={this.onCancelAddRouteList}
                            onCreate={this.onOKAddRouteList}
                        />

                        <AddTask
                            visible={this.state.addTaskVisible}
                            companies={this.state.companies}
                            onCancel={this.onCancelAddTask}
                            onCreateTask={this.onOKAddTask}
                        />

                        <DeleteTaskFromList
                            visible={this.state.showDeleteTaskListDialog}
                            taskListforDelete={this.state.taskListforDelete}
                            hideDeleteTaskListDialog={this.hideDeleteTaskListDialog}
                            taskListID={this.state.taskListID}
                            refreshTaskList={this.GetTasksByKey}
                        />

                        <div style={{ margin: '15px' }}>
                            <Button type="primary" onClick={this.showAddRouteList_Form} style={{ marginLeft: 8 }}>
                                Новый маршрутный лист
                            </Button>
                        </div>

                        <Table
                            rowClassName={(record, index) => {
                                if (index == this.state.selectedRowIndex) return "selected-routelist"
                            }}
                            pagination={{ pageSize: 5 }}
                            size="small"
                            scroll={{ scrollToFirstRowOnChange: true }}
                            //  rowSelection={rowSelection}
                            rowKey={rec => (rec.ID)}
                            columns={columns}
                            dataSource={this.state.routeListData}

                            onRow={(record, rowIndex) => {
                                var self = this;
                                return {
                                    onClick: event => {
                                        console.log(event.target.text == 'Удалить', record, rowIndex);
                                        //this.setState({ selectedRouteList: record });
                                        self.setState({
                                            selectedRowIndex: rowIndex,
                                            selectedRouteList: record,
                                        });

                                        //document.body.style.cursor = "progress";
                                        //
                                        this.GetTasksByKey(record.ID)
                                        //
                                        // getTasksBykey(this.state.taskListID, record.ID)
                                        //     .then((data) => {
                                        //         console.log("tasks by key ", data);
                                        //         //передаем полученные задания в App для последующей передачи в Yandex
                                        //         let convertedData = convertTaskArray(data.result);
                                        //         self.props.setRouteListTasks(convertedData);

                                        //         self.setState({
                                        //             tasksByRouteList: convertedData
                                        //         });
                                        //         document.body.style.cursor = "";
                                        //     })
                                        document.body.style.cursor = "";
                                    }
                                }
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <ButtonGroup style={{ margin: '15px' }}>
                            <Button onClick={this.showAddTask_Form}>Новая задача</Button>
                            <Button onClick={this.buildTasks}>Поставить задачи</Button>
                        </ButtonGroup>
                        <div>
                            <Table
                                pagination={{ pageSize: 5 }}
                                size="small"
                                rowKey={rec => (rec.ID)}
                                columns={taskColumns}
                                dataSource={this.state.tasksByRouteList}
                                onRow={(record, rowIndex) => {
                                    var self = this;
                                    return {
                                        onClick: event => {
                                            if (event.target.text === 'Удалить') {
                                                console.log(record, rowIndex);
                                                this.setState(
                                                    {
                                                        showDeleteTaskListDialog: true,
                                                        taskListforDelete: record
                                                    }
                                                )
                                            }
                                        }
                                    }
                                }
                                }
                            />
                        </div>
                    </Col>
                </Row>
            </div >
        )
    }
}

export default RouteList