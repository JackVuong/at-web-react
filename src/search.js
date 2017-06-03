import logo from './logo.png'
import { Form, Layout, Menu, Icon, Row, Col, Button, Input, message } from 'antd';
import React, { Component } from 'react'
import _ from 'lodash'
import { getData } from './firebase'
import LoginForm from './signin'
const { Header, Content } = Layout;
const WrappedLoginForm = Form.create()(LoginForm)
class SearchPage extends Component {
    constructor(props) {
    super(props);
    this.state = {
        studentID:''
    }}

    handleSearchEvent=()=>{
        const studentID = document.getElementById('event').value
        console.log(studentID)
        getData(`DiemDanh/SuKien/${this.state.studentID}`).then((listDiemDanh)=>console.log(listDiemDanh))
    }

    render() {
        return (
            <Layout style={{ height: '100%' }}>
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
                        <Row type='flex' justify='center' style={{ height: '100%', marginTop: 100 }}>
                            <img alt='logo' src={logo} style={{ height: 150, padding: 7 }} />
                        </Row>
                        <Row type='flex' justify='center'>
                            <Input id='event' value={this.state.studentID} style={{ width: 500, height: 40,marginTop: 10 }} placeholder='Input your student ID here to search your attendance'
                            onChange={(e)=>{this.setState({studentID:e.target.value})}}
                             />
                        </Row>
                        <Row type='flex' justify='center'style={{ height: '100%', marginTop: 10 }} >
                            <Button style={{ background:'#dce0e5',height:40, width:120 }}
                            onClick={()=>this.handleSearchEvent()}
                            >
                            <strong style={{ color: '#4a4b4c' }}>Search Event</strong>
                            </Button>
                            <Button style={{ background:'#dce0e5',height:40, width:120, marginLeft:20}}>
                            <strong style={{ color: '#4a4b4c' }}>Search Class</strong>
                            </Button>
                        </Row>
                    </Content>
                </Layout>
            </Layout>);
    }
}

export default SearchPage