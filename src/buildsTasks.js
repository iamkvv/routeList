
import { addTask } from './bitrixapi'

function setTaskAndTaskRecord(taskRecord, cb) {
    setTimeout(() => {
        console.log("taskRecord", taskRecord);
        addTask(taskRecord.ADDRESS, taskRecord.USER_ID, taskRecord.TASK, taskRecord.GIS, taskRecord.COMPANY_ID)
            .then(data => {
                console.log("after buildTask", data.result);
                cb();
            })
    }, 1000);
}

function BuildTasks(arr) {
    var curr = 0;
    function callback() {
        if (curr < arr.length) {
            setTaskAndTaskRecord(arr[curr++], callback);
        }
    }

    return callback;
}

export { BuildTasks }