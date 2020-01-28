import { addTask, updateTasklist } from './bitrixapi'

function setTaskAndTaskRecord(taskRecord, iblock_id, cb) {
    setTimeout(() => {
        addTask(taskRecord.ADDRESS, taskRecord.USER_ID, taskRecord.TASK, taskRecord.GIS, taskRecord.COMPANY_ID)
            .then(data => {
                updateTasklist(taskRecord.ID, iblock_id, taskRecord.FK, taskRecord.DATE, taskRecord.USER_ID, taskRecord.FIO, taskRecord.COMPANY_ID, taskRecord.COMPANY, taskRecord.GIS, taskRecord.TEL, taskRecord.TASK, taskRecord.ADDRESS, data.result.task.id)
                    .then(data => {
                        console.log("after updateTasklist", data);
                        cb();
                    })
            })
    }, 300);
}

function BuildTasks(arr, tasklist_id) {
    var curr = 0;
    function callback() {
        if (curr < arr.length) {
            setTaskAndTaskRecord(arr[curr++], tasklist_id, callback);
        }
    }
    return callback;
}

export { BuildTasks }