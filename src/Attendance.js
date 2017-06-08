import logo from './logo.png'
import {Row, Icon, Table} from 'antd'
import React, { Component } from 'react'
import _ from 'lodash'
import './events.css'
import './table.css'

const columns = [
    {
        title:'MSSV',
        dataIndex:'MSSV'
    },
    {
        title:'Ngày giờ',
        dataIndex:'ngayGio'
    }
]

class Attendance extends Component {
    constructor(props) {
        super(props);
    }

    getDataSource =(data) =>{
        let dataSource = []
         _.forEach(data, (item) => {           
             let object = {
                 MSSV: item.mssv,
                 ngayGio: item.ngayGio
             }
             dataSource.push(object)          
         })
         return dataSource
    }

    render() {
        const data = _.filter(this.props.diemdanh.Lop,['maLop',this.props.maLop])
        const DataSource = this.getDataSource(data)
        return (
            <Row type='flex' justify='center' style={{ height: '100%', marginTop: 30 }}>
                <Table columns={columns} dataSource={DataSource} />
            </Row>
        );
    }
}
export default Attendance
