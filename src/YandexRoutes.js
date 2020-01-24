import React, { Component } from 'react'
import { YMaps, Map } from 'react-yandex-maps';
import { Button } from 'antd';

class YandexRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log("Yandex didMount")
    }
    mapInstance = null;
    ymapi = null;

    onClickCalc = () => {
        this.props.rootfunc(this.ymapi, this.mapInstance)
    }


    onLoadMap = (apiobj) => {
        console.log("apiobj", apiobj);
        this.ymapi = apiobj;

        //или закинуть эти oбъекты в App?
        /*
                var self = this;
                apiobj.route([
                    'Челябинск, улица Косарева, 52Б',
                    {
                        point: 'Челябинск,Молдавская, 11',
                        type: 'viaPoint'
                    },
                    {
                        point: 'Челябинск,Бродокалмакский тракт, 6А',
                        type: 'viaPoint'
                    },
                    {
                        point: 'Челябинск,Энгельса, 129',
                        type: 'viaPoint'
                    },
                    {
                        point: 'Челябинск,проспект Ленина, 81',
                        type: 'viaPoint'
                    },
                    'Челябинск, улица Косарева, 52'
                ]).then(function (route) {
                    console.log("Route", route)
                    //debugger;
                    self.mapInstance.geoObjects.add(route);
                    console.log("Map", self.mapInstance)
                })
        */

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
                        <Button onClick={this.onClickCalc}>Calc</Button>
                    </div>
                    <Map defaultState={{
                        center: [55.15886, 61.40255],
                        zoom: 9
                    }}
                        //width={600} height={600}
                        style={{ margin: '20px auto', width: 600, height: 600 }}
                        instanceRef={(map) => this.mapInstance = map}
                        onLoad={(y) => {
                            console.log("Map onLoad", this, y); this.onLoadMap(y)
                        }}
                    >

                    </Map>
                </div>
            </YMaps>
        )
    }

}

export default YandexRoutes