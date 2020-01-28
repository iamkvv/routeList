import React, { Component } from 'react'
import { YMaps, Map } from 'react-yandex-maps';
import { Button, message } from 'antd';
import { updateRoutelist } from './bitrixapi'

class YandexRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskList: []
        }
    }

    mapInstance = null;
    ymapi = null;

    // componentDidMount() {
    //     console.log("DID Yandex didMount", this.props.tasksByRouteList)
    //     console.log("DID Yandex objs ", this.ymapi, this.mapInstance)
    // }
    onLoadMap = (apiobj) => {
        // console.log("apiobj", apiobj);//маршрут уже можно строить
        // console.log("mapInstance", this.mapInstance);
        this.ymapi = apiobj;
    }

    createRoute = () => {
        const { tasksByRouteList } = this.props;

        var RouteAddrs = [];
        //переделать в map!! ??
        for (var i = 0; i < tasksByRouteList.length; i++) {
            if (i == 0) {
                RouteAddrs.push(tasksByRouteList[i].ADDRESS)
            }
            if (i > 0 & i < tasksByRouteList.length - 1) {
                RouteAddrs.push(Object.assign({}, { point: tasksByRouteList[i].ADDRESS, type: 'viaPoint' }))
            }
            if (i == tasksByRouteList.length - 1) {
                RouteAddrs.push(tasksByRouteList[i].ADDRESS)
            }
        }

        //console.log("arrRoute", RouteAddrs)
        let self = this;
        this.ymapi.route(
            RouteAddrs

        ).then(function (route) {

            //  console.log("Map Objs ", self.mapInstance.geoObjects)
            self.mapInstance.geoObjects.removeAll()
            self.mapInstance.geoObjects.add(route);

            var points = route.getWayPoints(),
                lastPoint = points.getLength() - 1;
            // Задаем стиль метки - иконки будут красного цвета, и
            // их изображения будут растягиваться под контент.
            points.options.set('preset', 'islands#redStretchyIcon');
            // Задаем контент меток в начальной и конечной точках.
            points.get(0).properties.set('iconContent', 'старт: ' + points.get(0).properties.get("name"));
            points.get(lastPoint).properties.set('iconContent', 'финиш: ' + points.get(lastPoint).properties.get("name"));
            // debugger;
            var moveList = 'Трогаемся,</br>',
                way,
                segments;
            var meters = 0;
            // Получаем массив путей.
            for (var i = 0; i < route.getPaths().getLength(); i++) {
                way = route.getPaths().get(i);
                segments = way.getSegments();
                for (var j = 0; j < segments.length; j++) {
                    var street = segments[j].getStreet();
                    meters += segments[j].getLength();
                    moveList += ('Едем ' + segments[j].getHumanAction() + (street ? ' на ' + street : '') + ', проезжаем ' + segments[j].getLength() + ' м.,');
                    moveList += '</br>'
                }
            }
            moveList += 'Останавливаемся.';

            //массив заданий для вывода под картой
            let tasks = tasksByRouteList.map(tsk => ({ Company: tsk.COMPANY, Tel: tsk.TEL, Address: tsk.ADDRESS, Task: tsk.TASK }))

            // console.log("PrintTasks!!", tasks);

            self.setState({ taskList: tasks });
            // Выводим маршрутный лист.
            // $('#list').append(moveList);
            // $('#meters').append(meters/1000);
            //alert("Длина маршрута " + Math.round(meters / 1000) + " км")

            //(elementid,iblockid, name, user_id, fio, date, comment,path)

            updateRoutelist(self.props.currentRouteList.ID,
                60,
                self.props.currentRouteList.NAME,
                self.props.currentRouteList.USER_ID,
                self.props.currentRouteList.FIO,
                self.props.currentRouteList.DATE,
                self.props.currentRouteList.COMMENT,
                Math.round(meters / 1000)
            )
                .then(data => {
                    //  console.log("after UpdateRouteList", data);
                    message.info(`Длина маршрута : ${Math.round(meters / 1000)} км`);
                })


        })
    }

    onClickCalc = () => {
        //  this.props.rootfunc(this.ymapi, this.mapInstance)
        this.createRoute();
    }



    render() {
        return (
            <YMaps query={{
                lang: 'ru_RU',
                mode: 'release',
                apikey: 'a251630e-2cd2-42fb-a025-8e2f375579de',
                load: 'package.full', width: 600, height: 600
            }}>
                <div style={{ width: 605, heigth: 605, margin: '10px auto' }}>

                    <div >
                        <Button onClick={this.createRoute}>Построить маршрут</Button>
                    </div>
                    <Map defaultState={{
                        center: [55.15886, 61.40255],
                        zoom: 13
                    }}

                        style={{ margin: '20px auto', width: 600, height: 600 }}
                        instanceRef={(map) => this.mapInstance = map}
                        onLoad={(y) => {
                            // console.log("Map onLoad", this, y); 
                            this.onLoadMap(y)
                        }}
                    >

                    </Map>
                    <div>
                        <table className="task-list-print">
                            <tbody>
                                {this.state.taskList.map((tsk) => {
                                    return <tr>
                                        <td>{tsk.Company}</td>
                                        <td style={{ width: '100%' }}>{tsk.Address}</td>
                                        <td>{tsk.Tel}</td>
                                        <td dangerouslySetInnerHTML={{ __html: tsk.Task }}></td>
                                    </tr>
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </YMaps>
        )
    }

}

export default YandexRoutes