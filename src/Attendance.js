import logo from './logo.png'
import {Row, Icon, Table, Tag} from 'antd'
import React, { Component } from 'react'
import _ from 'lodash'
import './events.css'
import './table.css'

const columns = [
    {
        title:'Student ID',
        dataIndex:'MSSV'
    },
    {
        title:'Date',
        dataIndex:'date',
        render: text => <div>{text}</div>
        //render: text =><Tag color="cyan">{text}</Tag>       
    },
    {
        title:'Total',
        dataIndex:'total'
    }
]

class Attendance extends Component {
    constructor(props) {
        super(props);
    }

    getDate = (item) => {
        let date =''
        _.forEach(item,(i)=>{
            date = date+ i.ngayGio + '<br/>'
        })
        return date
    }

    getDataSource =(data) =>{
        let dataSource = []
         _.forEach(data, (item,key) => {           
             let object = {
                 MSSV: key,
                 date: this.getDate(item),
                 total: _.size(item)
             }
             dataSource.push(object)          
         })
         return dataSource
    }

    render() {
        const data = _.groupBy(_.filter(this.props.diemdanh.Lop,['maLop',this.props.maLop]),'mssv')
        const DataSource = this.getDataSource(data)
        return (
            <Row type='flex' justify='center' style={{ height: '100%', marginTop: 30 }}>
                <div id ='table_wrapper'>
                <Table columns={columns} dataSource={DataSource} bordered />
                </div>
            </Row>
        );
    }
}
export default Attendance
