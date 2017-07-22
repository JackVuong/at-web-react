import logo from './logo.png'
import { Row, Icon, Table, Tag, Tooltip, Button, Col} from 'antd'
import React, { Component } from 'react'
import _ from 'lodash'
import './events.css'
import './table.css'
import {update} from './firebase'

const columns = [
    {
        title: 'Student ID',
        dataIndex: 'MSSV'
    },
    {
        title: 'Date',
        dataIndex: 'date',
        render: text =>
            text.map((date) =>
                <Tag color="cyan">{date.ngayGio}</Tag>
            )

    },
    {
        title: 'Total',
        dataIndex: 'total',

    }
]

class Attendance extends Component {
    constructor(props) {
        super(props);
    }

    getDate = (item) => {
        let date = ''
        _.forEach(item, (i) => {
            date = date + i.ngayGio + ' '
        })
        return date
    }

    getDataSource = (data) => {
        let dataSource = []
        _.forEach(data, (item, key) => {
            let object = {
                MSSV: key,
                date: item,
                total: _.size(item)
            }
            dataSource.push(object)
        })
        return dataSource
    }

    render() {
        let data
        if(_.isUndefined(this.props.currentClass)) {
            return(
                <div></div>
                );
        }
        if(_.isNil(this.props.currentClass.tenSuKien)) {
            data = _.groupBy(_.filter(this.props.diemdanh[0], ['maLop', this.props.maLop]), 'mssv')
        }
        else {
            data = _.groupBy(_.filter(this.props.diemdanh[1], ['maSuKien', _.toString(this.props.maLop)]), 'mssv')
        }
        const DataSource = this.getDataSource(data)
        return (         
            <div style={{ marginTop: 20 }}>
                <Row type='flex' justify='center' style={{ height: '100%', marginTop: 30 }}>
                    <div id='table_wrapper'>
                        <Table columns={columns} dataSource={DataSource} bordered />
                    </div>
                </Row>
            </div>
        );
    }
}
export default Attendance
