import React from 'react'
import { Modal, message } from 'antd';
import { deleteTasklist } from './bitrixapi'

//удаление записи задания из списка (еще удалить Задачу!!)
const delTaskList = (tasklistid, record, refresh, hideCallback) => {
    console.log(record);
    deleteTasklist(tasklistid, record.ID)
        .then(data => {
            if (data.result) {
                message.info("Запись успешно удалена.");
                refresh(record.FK);
            } else {
                alert("Не удалось удалить запись")
            }
            console.log('delete then', data)
        });
    hideCallback()
}


const DeleteTaskFromList = (props) => {
    return (
        <Modal
            visible={props.visible}
            title="Удаление задания маршрутного листа"
            centered
            okText="Да"
            cancelText="Нет"
            onOk={() => delTaskList(props.taskListID, props.taskListforDelete, props.refreshTaskList, props.hideDeleteTaskListDialog)}
            onCancel={props.hideDeleteTaskListDialog}
        >
            <p>Вы хотите удалить эту запись?</p>
        </Modal>
    )
}

export default DeleteTaskFromList