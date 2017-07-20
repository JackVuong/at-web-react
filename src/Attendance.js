import logo from './logo.png'
import { Row, Icon, Table, Tag, Tooltip, Button, Col, Popconfirm, message} from 'antd'
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

    confirm = (e)=> {
        if(_.isNil(this.props.currentClass.eventName)) {
            update(`Lop/${this.props.maLop}`,null)
        }
        else {
            update(`SuKien/${this.props.maLop}`,null)
        }
        console.log(this.props)
    message.success('Deleted');
    }

    cancel = (e)=> {
    //message.error('Click on No');
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
        if(_.isNil(this.props.currentClass.eventName)) {
            data = _.groupBy(_.filter(this.props.diemdanh.Lop, ['maLop', this.props.maLop]), 'mssv')
        }
        else {
            data = _.groupBy(_.filter(this.props.diemdanh.SuKien, ['maSuKien', _.toString(this.props.maLop)]), 'mssv')
        }
        const DataSource = this.getDataSource(data)
        return (
            <div style={{ marginTop: 20 }}>
                <Row type='flex' style={{ height: '100%' }} >
                    {
                        _.isNil(this.props.currentClass.eventName)?
                        <label style={{ fontSize: 25 }}>{this.props.currentClass.tenMH} nhóm {this.props.currentClass.nhomMH} tổ {this.props.currentClass.toMH}</label>
                        :
                        <label style={{ fontSize: 25 }}>{this.props.currentClass.eventName} - {this.props.currentClass.place}</label>
                    }
                    
                    
                        <div>
                            <Tooltip title="Edit">
                                <Button type="primary" ghost shape="circle" icon="edit" size='large' style={{ marginBottom: 10, marginLeft: 5 }} />
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Popconfirm title="Are you sure delete this?" onConfirm={this.confirm} onCancel={this.cancel} okText="Yes" cancelText="No">
                                <Button type="danger" ghost shape="circle" icon="close-circle" size='large' style={{ marginBottom: 10, marginLeft: 5 }} />
                                </Popconfirm>
                            </Tooltip>
                        </div>
                    

                </Row>
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
