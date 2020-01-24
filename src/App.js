import './App.css'

import React, { Component } from 'react'
import { Tabs, Row, Col, message } from 'antd';
import { LocaleProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';


//import { convertRouteListArray } from './helper'

import RouteList from './routeList'
//import RouteManager from './routeManager'
import YandexRoutes from './YandexRoutes'

const { TabPane } = Tabs;

/**
 * 
 * компании с польз. полями
 * юр. адрес "UF_CRM_5E1D86B235DB7": "Челябинск, энгельса 44 ЮР"
 * https://anywhere.bitrix24.ru/rest/crm.company.list?filter[%TITLE]=Вось&auth=cf8d295e0043baa40031392000000001201c03ba39ef4407b76c6cdc429dcc32ecc79d&select[]=UF_*&select[]=TITLE
 * 
 * фильтрация filter[ID][0]=1493&filter[ID][1]=1447  // http://forum330.com/forum/6075/all
 * 
 * в ответе больше 50 // https://dev.1c-bitrix.ru/support/forum/forum48/topic90017/
 * 
 * пользов-ие поля //https://www.bitrix24.com/support/forum/forum45/topic20775/
 * http://YOURSUBDOMAIN.bitrix24.com/rest/crm.lead.list.json?auth=ACCESSTOKEN&select[]=*&select[]=UF_*
 * 
 * фильтр списка по польз. полю
 * https://anywhere.bitrix24.ru/rest/lists.element.get?auth=9b43285e0043baa40031392000000001201c03ab433500500b536930e1fb999b3c1d0d&IBLOCK_TYPE_ID=lists&IBLOCK_ID=60&filter[PROPERTY_230]=Иванов
 * 
 * 
 * фильтрация задач по FK
 * https://anywhere.bitrix24.ru/rest/lists.element.get?filter[PROPERTY_236]=218&auth=1565295e0043baa40031392000000001201c0301a80cec933590efcde30d901b0fab66&IBLOCK_TYPE_ID=lists&IBLOCK_ID=64
 * 
 * 
 * Получить все мои списки
 * https://anywhere.bitrix24.ru/rest/lists.get?auth=eef3255e0043baa40031392000000001201c03d29bb972b73022d9379ece068d5b9381&IBLOCK_TYPE_ID=lists
 */

class App extends Component {
  state = { tasksByRouteList: [] };

  handleChange = date => {
    message.info(`Selected Date: ${date ? date.format('YYYY-MM-DD') : 'None'}`);
    this.setState({ date });
  };

  setRouteListTasks = (arr) => {

    console.log("setRouteListTasks!!!", arr);

    this.setState({ tasksByRouteList: arr })
  }

  TabsCallback(key) {
    console.log(key);
  }

  rootfunc = (api, map) => {
    console.log("from APP ", api, map)

    // var arrRoute = this.state.tasksByRouteList.map(function (_i,tsk, ) {
    //   console.log("ind tsk", _i, tsk);
    //   return tsk.ADDRESS
    // });

    var arrRoute = [];

    for (var i = 0; i < this.state.tasksByRouteList.length; i++) {
      if (i == 0) {
        arrRoute.push(this.state.tasksByRouteList[i].ADDRESS)
      }
      if (i > 0 & i < this.state.tasksByRouteList.length - 1) {
        arrRoute.push(Object.assign({}, { point: this.state.tasksByRouteList[i].ADDRESS, type: 'viaPoint' }))
      }
      if (i == this.state.tasksByRouteList.length - 1) {
        arrRoute.push(this.state.tasksByRouteList[i].ADDRESS)
      }
    }

    console.log("arrRoute", arrRoute);

    api.route(
      arrRoute
      //   [
      //   'Челябинск, улица Косарева, 52Б',
      //   {
      //     point: 'Челябинск,Молдавская, 11',
      //     type: 'viaPoint'
      //   },
      //   {
      //     point: 'Челябинск,Бродокалмакский тракт, 6А',
      //     type: 'viaPoint'
      //   },
      //   {
      //     point: 'Челябинск,Энгельса, 129',
      //     type: 'viaPoint'
      //   },
      //   {
      //     point: 'Челябинск,проспект Ленина, 81',
      //     type: 'viaPoint'
      //   },
      //   'Челябинск, улица Косарева, 52Б'
      // ]
    ).then(function (route) {

      map.geoObjects.add(route);

      var points = route.getWayPoints(),
        lastPoint = points.getLength() - 1;
      // Задаем стиль метки - иконки будут красного цвета, и
      // их изображения будут растягиваться под контент.
      points.options.set('preset', 'islands#redStretchyIcon');
      // Задаем контент меток в начальной и конечной точках.
      points.get(0).properties.set('iconContent', 'Точка отправления');
      points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');

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
      // Выводим маршрутный лист.
      // $('#list').append(moveList);
      // $('#meters').append(meters/1000);
      alert(Math.round(meters / 1000))



    })
  }

  render() {
    return (
      <LocaleProvider locale={ruRU}>
        <Row type="flex" justify="center" align="top">
          <Col span={19}>
            <Tabs defaultActiveKey="1" onChange={this.TabsCallback}>
              <TabPane tab="Маршрутные листы" key="1">
                <RouteList setRouteListTasks={this.setRouteListTasks} />
              </TabPane>
              <TabPane tab="Yandex карта" key="2">
                <YandexRoutes rootfunc={this.rootfunc} />
              </TabPane>
            </Tabs>
          </Col>
          <Col span={4}>
            <h2>test</h2>
          </Col>
        </Row>
      </LocaleProvider>
    )
  }
}

export default App
