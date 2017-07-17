import React, { Component } from 'react'
import _ from 'lodash'
import {Form, Layout, Menu, Icon, Row, Col, Button, Input, Modal, InputNumber, Switch, Select, message, Dropdown} from 'antd'
import Loading from './Loading'
import Forbidden from './Forbidden'
import './App.css'
import './events.css'
import logo from './logo.png'
import user from './user.png'
import firebase from './firebase'
import { getData, update, getLastIndex } from './firebase'
import CreateSubjectForm from './CreateSubjectForm'
import CreateClassForm from'./CreateClass'
import Attendance from './Attendance'
const { Header, Content, Sider } = Layout
const SubMenu = Menu.SubMenu
const Option = Select.Option
const FormItem = Form.Item

const onClickProfileMenu = function ({ key }) {
  if(_.isEqual(key,'signout'))
  {
    firebase.auth().signOut()
    window.location.replace('/')
  }
}

const profileMenu = (
  <Menu onClick={onClickProfileMenu}>
    <Menu.Item key="info">Your profile</Menu.Item>
    <Menu.Item key="settting">Setting</Menu.Item>
    <Menu.Item key="signout">Sign out</Menu.Item>
  </Menu>
);

const success = () => {
  message.success('Saved successfully')
};
class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mode: 'inline',
      loading: true,
      visible: false,
      visiblePopupCreateClass: false

    };
  }
  componentDidMount() {
    Promise.all([getData('MonHoc'), getData('Lop'),getData('DiemDanh'), getData('SuKien')])
      .then(([subjects, classes, diemdanh, events]) => this.setState({
        subjects,
        classes,
        diemdanh,
        events,
        loading: false
      }));
  }
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }
  onSelectClass = (e) => {
    const maMH = _.get(this.state.classes,`${e.key}.MaMH`)
    const nhomMH = _.get(this.state.classes,`${e.key}.NhomMH`)
    const toMH = _.get(this.state.classes,`${e.key}.ToMH`)
    const tenMH = _.find(this.state.subjects,['MaMH',maMH]).TenMH
    const currentClass={maMH,nhomMH,toMH,tenMH}
    this.setState({
      selectedClass: e.key,
      currentClass
    });
  }

  showModalCreateSubject = () => {
    this.setState({
      visible: true,
    });
  }

  showModalCreateClass = () => {
    this.setState({
      visiblePopupCreateClass: true,
    });
  }

  handleSaveSubject = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      getLastIndex(`MonHoc`).then((lastIndex) => this.addNewSubject(lastIndex, values.subjectCode, values.subjectName))
      this.setState({
        visible: false,
      });
    });
  }

  addNewSubject = (lastIndex, code, name) => {
    let newIndex = parseInt(lastIndex) + 1
    let newSubject = {
      MaMH: code,
      TenMH: name
    }
    update(`MonHoc/${newIndex}`, newSubject)
    this.setState({
      subjects: {
        ...this.state.subjects,
        [newIndex]: newSubject
      }
    });
    success()
  }

  handleSaveClass = () => {
    const form = this.form2;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      getLastIndex('Lop').then((lastIndex) => this.addNewClass(lastIndex, values))
      success()
      this.setState({
        visiblePopupCreateClass: false,
      });
    });
  }

  addNewClass = (lastIndex, values) => {
    let newIndex = parseInt(lastIndex) + 1
    let newClass = {
      key: newIndex,
      GV:values.giangvien,
      HocKy: values.hocky,
      MaMH: values.monhoc,
      NamHoc: values.namhoc,
      NhomMH: values.nhom,
      ToMH: values.to
    }
    update(`Lop/${newIndex}`, newClass)
    this.setState({
      classes: {
        ...this.state.classes,
        [newIndex]: newClass
      }
    });

  }

  handleCancel = (e) => {
    const form = this.form;
    form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onCancel = (e) => {
    const form = this.form2;
    form.resetFields();
    this.setState({
      visiblePopupCreateClass: false,
    });

  }

  saveFormRef = (form) => {
    this.form = form;
  }

  saveForm2Ref = (form2) => {
    this.form2 = form2;
  }

  handleUniqueCode = (rule, value, callback) => {
    if (value && _.some(this.state.subjects, ['MaMH', value])) {
      callback('Subject code should be unique ！')
    }
    callback()
  }

  validateGroupAndTeam = (rule, value, callback) => {
    const form = this.form2;
    let nhom = form.getFieldValue('nhom')
    let to = form.getFieldValue('to')
    let maMH = form.getFieldValue('monhoc')
    if (value && _.some(this.state.classes, {'NhomMH':nhom,'ToMH':to,'MaMH':maMH})) {
      callback(`Group ${nhom} team ${to} is already exists in this subject `)
    }
    callback()
  }

  handleExportXls = () =>{
    
    const data_type = 'data:application/vnd.ms-excel';
    const table_div = document.getElementById('table_wrapper');
    const table_html = table_div.outerHTML.replace(/ /g, '%20');

    let a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'attendance_tracking_'+this.state.currentClass.tenMH+'_' + this.state.currentClass.maMH+'_nhom'
    +this.state.currentClass.nhomMH+'_to_'+this.state.currentClass.toMH + '.xls';
    a.click();
  }

  render() {
    if(_.isNil(firebase.auth().currentUser) || !firebase.auth().currentUser.emailVerified)
      return<Forbidden/>;
    if (this.state.loading) return <Loading />;
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff  ', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 70, padding: 7 }} />
            </Col>
            <Col>
            <Button type='primary' onClick={this.showModalCreateSubject} style={{height: 40, fontSize: 15}}><Icon type="plus-circle-o" style={{fontSize:18}} />Add subject</Button>
                  
            <Button type='primary' onClick={this.showModalCreateClass} style={{height: 40, fontSize: 15, marginLeft:20 }}><Icon type="plus-circle-o" style={{fontSize:18}}/>Add Class</Button>
            <CreateSubjectForm
                  ref={this.saveFormRef}
                  visible={this.state.visible}
                  onCancel={this.handleCancel}
                  onCreate={this.handleSaveSubject}
                  handleUniqueCode={this.handleUniqueCode}
                />             

                <CreateClassForm
                  ref={this.saveForm2Ref}
                  visible={this.state.visiblePopupCreateClass}
                  onCancelCreateClass={this.onCancel}
                  onCreateClass={this.handleSaveClass}
                  subjects={this.state.subjects}
                  validateGroupAndTeam={this.validateGroupAndTeam}
                />
            </Col>
            <Col style={{ paddingRight: 20 }}>       
            Luan Vuong     
              <Dropdown overlay={profileMenu}>
              <img alt='user' src={user} style={{ height: 70, padding: 7 }} />
              </Dropdown>
              
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu theme="dark"
              mode={this.state.mode}
              selectedKeys={[this.state.selectedProfile]}
              inlineIndent={10}
              onClick={this.onSelectClass}
              selectedKeys={[this.state.selectedClass]}
            >
              <SubMenu
                key="subject"
                title={<span><Icon type="star" /><span className="nav-text">Subjects </span></span>}
                
              >
                {
                  _.map(this.state.subjects, (subject) => <SubMenu key={subject.MaMH} title={<span>{subject.TenMH}</span>}>
                    {
                      _.map(_.filter(this.state.classes, ['MaMH', subject.MaMH]), (lop) => <Menu.Item key={lop.key}>Nhóm {lop.NhomMH} Tổ {lop.ToMH}</Menu.Item>)
                    }
                  </SubMenu>)
                }
              </SubMenu>
              <SubMenu
                key="event"
                title={<span><Icon type="flag" /><span className="nav-text">Events </span></span>}             
              >
              {
                  _.map(this.state.events, (event) => <SubMenu key={event.key} title={<span>{event.tenSuKien}</span>}>
                  </SubMenu>)
                }
              </SubMenu>
              <Menu.Item key='Report'>
                <span>
                  <Icon type="area-chart" />
                  <span className="nav-text">Report</span>
                </span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
                          
                

              <Row>
                {
                  _.isNil(this.state.selectedClass)?null:
                  <div>                  
                  <Attendance diemdanh={this.state.diemdanh} maLop={this.state.selectedClass} currentClass={this.state.currentClass}/>
                  <Row type='flex' justify='center'>
                  <Button onClick={()=>this.handleExportXls()} >Export to xls</Button>
                  </Row>
                  </div>
                }
              </Row>
              
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default MainPage;
