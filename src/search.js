import logo from './logo.png'
import { Form, Layout, Row, Col, Button, Input, message, BackTop, Icon, Timeline, Table} from 'antd';
import React, { Component } from 'react'
import _ from 'lodash'
import './events.css';
import Loading from './Loading';
import { getData } from './firebase'
import LoginForm from './signin'
const { Header, Content } = Layout;
const WrappedLoginForm = Form.create()(LoginForm)
const columns = [
    {
        title:'ML',
        dataIndex:'maLop',
        key:'maLop'
    },
    {
        title:'Date',
        dataIndex:'ngayGio',
        key:'ngayGio'
    }
]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',    // Column configuration not to be checked
  }),
};

class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataEvents: null,
            dataClass: null,
            loading: true
        };
    }

    componentDidMount() {
        Promise.all([getData('MonHoc'), getData('Lop')])
            .then(([subjects, classes]) => this.setState({
                subjects,
                classes,
                loading: false
            }));
    }



    handleSearchEvent = () => {
        
        const studentID = document.getElementById('studentId').value
        if (!_.isEmpty(studentID)) {
            getData(`DiemDanh/SuKien/${studentID}`).then((dataEvents) => 
            this.setState({ 
                dataEvents,
                dataClass: null 
            }))}
    }

    getDataSource = (data) => {
        let dataSource = []
        let i = 0
         _.forEach(data, (item) => {           
             let object = {
                 key : i++,
                 maLop : item.maLop,
                 ngayGio: item.ngayGio
             }
             dataSource.push(object)          
         })
         this.setState({
             dataClass: dataSource,
             dataEvents: null
         })
    }

    handleSearchClass = () => {
        const studentID = document.getElementById('studentId').value
        if (!_.isEmpty(studentID)) {
            getData(`DiemDanh/Lop/${studentID}`).then((dataClass) => 
             this.getDataSource(dataClass))}
    }


    render() {
        if (this.state.loading) return <Loading />;
        return (
            <Layout style={{ height: '100%' }}>
                <BackTop />
                <Header style={{ background: '#011f49', padding: 0 }}>
                    <Row type='flex' justify='space-between' style={{ height: '100%' }}>
                        <Col span={4}>
                            <img alt='logo' src={logo} style={{ height: 70, padding: 7 }} />
                        </Col>
                        <Col style={{ paddingRight: 20 }}>
                            <WrappedLoginForm />
                        </Col>
                    </Row>
                </Header>
                <Layout>
                    <Content style={{ margin: '0 16px' }}>
                        <Row type='flex' justify='center' style={{ height: '100%', marginTop: 80 }}>
                            <img alt='logo' src={logo} style={{ height: 150, padding: 7 }} />
                        </Row>
                        <Row type='flex' justify='center'>
                            <Input id='studentId' style={{ width: 500, height: 40, marginTop: 10 }}
                                placeholder='Input your student ID here to search your attendance'
                            />
                        </Row>
                        <Row type='flex' justify='center' style={{ height: '100%', marginTop: 10 }} >
                            <Button style={{ background: '#dce0e5', height: 40, width: 120 }}
                                onClick={() => this.handleSearchEvent()}
                            >
                                <strong style={{ color: '#4a4b4c' }}>Search Event</strong>
                            </Button>
                            <Button style={{ background: '#dce0e5', height: 40, width: 120, marginLeft: 20 }}
                                onClick={() => this.handleSearchClass()}
                            >
                                <strong style={{ color: '#4a4b4c' }}>Search Class</strong>
                            </Button>
                        </Row>
                        {
                            _.isNil(this.state.dataEvents) ?
                                null
                                :
                                <Row type='flex' justify='center' style={{ height: '100%', marginTop: 30 }}>
                                    <Timeline style={{ borderLeft: '#f77bed}' }}>
                                        {
                                            _.map(this.state.dataEvents, (event) =>
                                                <Timeline.Item color="green">
                                                    <p>{event.maLop}</p>
                                                    <p>{event.diaDiem}</p>
                                                    <p>{event.ngayGio}</p>
                                                </Timeline.Item>
                                            )
                                        }
                                    </Timeline>
                                </Row>

                        }
                        {
                            _.isNil(this.state.dataClass)?
                                null
                                :
                                <Row type='flex' justify='center' style={{ height: '100%', marginTop: 30 }}>
                                    <Table columns={columns} dataSource={this.state.dataClass} />
                                </Row>

                        }
                    </Content>
                </Layout>
            </Layout>);
    }
}

export default SearchPage