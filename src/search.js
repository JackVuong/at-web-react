import logo from './logo.png'
import './events.css'
import { Form, Layout, Row, Col, Button, Input, message, BackTop, Icon, Timeline, Table} from 'antd';
import React, { Component } from 'react'
import _ from 'lodash'
import Loading from './Loading';
import { getData } from './firebase'
import LoginForm from './signin'
import ReCAPTCHA from 'react-google-recaptcha'
import firebase from './firebase'
const { Header, Content, Footer } = Layout;
const WrappedLoginForm = Form.create()(LoginForm)
const info = () => {
  message.info('Make sure you are human');
}
const columns = [
    {
        title:'Tên môn học',
        dataIndex:'TenMH'
    },
    {
        title:'Nhóm',
        dataIndex:'NhomMH'
    },
    {
        title:'Tổ',
        dataIndex:'ToMH'
    },
    {
        title:'Ngày giờ',
        dataIndex:'ngayGio'
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
            reCaptcha:null,
            loading: true
        };
    }

    componentDidMount() {
        Promise.all([getData('MonHoc'), getData('Lop'), getData('SuKien')])
            .then(([subjects, classes, events]) => this.setState({
                subjects,
                classes,
                events,
                loading: false
            }));
    }



    handleSearchEvent = () => {
        if(this.state.reCaptcha) {
            this.setState({reCaptcha:null})
        const studentID = document.getElementById('studentId').value
        if (!_.isEmpty(studentID)) {
            getData(`DiemDanh/SuKien`).then((dataEvents) => 
            this.setState({ 
                dataEvents:_.filter(dataEvents,['mssv',studentID]),
                dataClass: null 
            }))}
        } else{
            info()
        }
    }

    getDataSource = (data,studentId) => {
        const filterData = _.filter(data,['mssv',studentId])
        let dataSource = []
         _.forEach(filterData, (item) => {         
             let object = {
                 TenMH : _.find(this.state.subjects,['MaMH',_.get(this.state.classes,`${item.maLop}.MaMH`)]).TenMH,
                 NhomMH: _.get(this.state.classes,`${item.maLop}.NhomMH`),
                 ToMH: _.get(this.state.classes,`${item.maLop}.ToMH`),
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
        if(this.state.reCaptcha) {
            this.setState({reCaptcha:null})
        const studentID = document.getElementById('studentId').value
        if (!_.isEmpty(studentID)) {

            getData(`DiemDanh/Lop`).then((dataClass) => 
             this.getDataSource(dataClass,studentID))}
        } else{
            info()
        }
        
    }

    handleRecapcha = (value) => this.setState({reCaptcha:value})

    render() {
        if (this.state.loading) return <Loading />;
        return (
            <Layout style={{ height: '100%' }}>
                <BackTop />
                <Header style={{ background: '#011f49', padding: 0 }}>
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
                            <Row type='flex' justify='center' style={{ marginTop: 10 }}>
                        {
                            _.isNil(this.state.reCaptcha)?
                            <ReCAPTCHA
                            ref='recaptcha'
                            sitekey='6Le-7iQUAAAAAEWJmV2u2jOeQj2SXHxh3zAn-a44'
                            onChange={(value)=>this.handleRecapcha(value)}
                        />
                        :
                        null
                        }                      
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
                            (_.isNil(this.state.dataEvents) || _.isEmpty(this.state.dataEvents))?
                                null
                                :
                                <Row type='flex' justify='center' style={{ height: '100%', marginTop: 30 }}>
                                    <Timeline style={{borderLeft:'2px solid #4df704'}}>
                                        {
                                            _.map(this.state.dataEvents, (event) =>
                                                <Timeline.Item color="green">
                                                    <p>{_.get(this.state.events, event.maSuKien).tenSuKien}</p>
                                                    <p>{_.get(this.state.events, event.maSuKien).diaDiem}</p>
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
                                    <Table columns={columns} dataSource={this.state.dataClass} bordered style={{background:'white'}}/>
                                </Row>

                        }
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Attendance Tracking ©2017 Created by dev team.
                        {
                            firebase.auth().currentUser?
                            <a href="/#/home"> Home page</a>
                            :
                            <div>
                            <a href="/#/signin"> Signin</a> or
                            <a href="/#/register"> register now!</a>
                            </div>
                        }
                        
                   </Footer>
                </Layout>
            </Layout>);
    }
}

export default SearchPage