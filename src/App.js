import './App.css'

import React, { Component } from 'react'
import { Tabs, Row, Col, message } from 'antd';
import { LocaleProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';
import RouteList from './routeList'
import YandexRoutes from './YandexRoutes'

const { TabPane } = Tabs;

/**
 * 
 * добавить задачу со ссылкой на компанию
 * https://anywhere.bitrix24.ru/rest/tasks.task.add?auth=92a72d5ea584efae697&fields[RESPONSIBLE_ID]=1&fields[TITLE]=для проверки10&fields[DESCRIPTION]=qwe
asd
&fields[UF_CRM_TASK][0]=CO_38
* также см. https://dev.1c-bitrix.ru/rest_help/tasks/task/item/add.php
*
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
  state = {
    tasksByRouteList: [] //задания выбранного марш. листа (для Yandex maps)
  };

  setRouteListTasks = (arr) => {
    this.setState({ tasksByRouteList: arr })
  }

  render() {
    return (
      <LocaleProvider locale={ruRU}>
        <Row type="flex" justify="center" align="top">
          <Col span={19}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Маршрутные листы" key="1">
                <RouteList setRouteListTasks={this.setRouteListTasks} />
              </TabPane>
              <TabPane tab="Yandex карта" key="2">
                {/** <YandexRoutes rootfunc={this.rootfunc} /> */}
                <YandexRoutes tasksByRouteList={this.state.tasksByRouteList} />
              </TabPane>
            </Tabs>
          </Col>
          <Col span={4}>
            <h2 className="reports" style={{ marginTop: 35, marginLeft: 15, color: 'cadetblue' }}>Место для итоговых отчетов</h2>
          </Col>
        </Row>
      </LocaleProvider>
    )
  }
}

export default App
