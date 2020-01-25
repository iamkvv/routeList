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
                        <Button onClick={this.onClickCalc}>Построить маршрут</Button>
                    </div>
                    <Map defaultState={{
                        center: [55.15886, 61.40255],
                        zoom: 13
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