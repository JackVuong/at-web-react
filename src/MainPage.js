import React, { Component } from 'react'
import _ from 'lodash'
import { Form, Layout, Menu, Icon, Row, Col, Button, Input, Modal, InputNumber, Switch, Select, message, Dropdown, Popconfirm,Tooltip } from 'antd'
import Loading from './Loading'
import Forbidden from './Forbidden'
import './App.css'
import './events.css'
import logo from './logo.png'
import user from './user.png'
import firebase from './firebase'
import { getData, update, getLastIndex } from './firebase'
import CreateSubjectForm from './CreateSubjectForm'
import CreateEventForm from './CreateEventForm'
import CreateClassForm from './CreateClass'
import Attendance from './Attendance'
const { Header, Content, Sider } = Layout
const SubMenu = Menu.SubMenu
const Option = Select.Option
const FormItem = Form.Item

const onClickProfileMenu = function ({ key }) {
  if (_.isEqual(key, 'signout')) {
    firebase.auth().signOut()
    window.location.replace('/')
  }
}
const filterUndifinedObjects = (objects) =>
    _.filter(objects, (o) => { return _.isObject(o) })

const profileMenu = (
  <Menu onClick={onClickProfileMenu}>
    <Menu.Item key="info">Profile</Menu.Item>
    <Menu.Item key="signout">Sign out</Menu.Item>
  </Menu>
);

const success = () => {
  message.success('Successfully created')
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
    getData('admin').then((admin)=>this.admin=admin)
  }
  
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }
  onSelectClass = (e) => {
    if(_.startsWith(e.key, 'event')) {
      const key = _.toNumber(_.trim(e.key,'event'))
      const currentClass = _.find(this.state.events, ['key', key])
      this.setState({
        selectedClass: key,
        currentClass
      })
    } else {
      const currentClass = _.find(this.state.classes,['key',_.toNumber(e.key)])
      const tenMH = _.find(this.state.subjects, ['MaMH', currentClass.MaMH]).TenMH

      this.setState({
        selectedClass: e.key,
        currentSubjectName: tenMH,
        currentClass
      })
    }

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

  showModalCreateEvent = () => {
    this.setState({
      visiblePopupCreateEvent: true,
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

  handleSaveEvent = () => {
    const form = this.form3;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      getLastIndex(`SuKien`).then((lastIndex) => this.addNewEvent(lastIndex, values.eventName, values.place))
      this.setState({
        visiblePopupCreateEvent: false,
      });
    });
  }

  addNewEvent = (lastIndex, name, place) => {
    let newIndex = parseInt(lastIndex) + 1
    let newEvent = {
      GV: firebase.auth().currentUser.email,
      tenSuKien: name,
      diaDiem: place,
      key:newIndex,
    }
    update(`SuKien/${newIndex}`, newEvent)
    this.setState({
      events: {
        ...this.state.events,
        [newIndex]: newEvent
      },
      yourEvents: {
        ...this.state.yourEvents,
        [newIndex]: newEvent
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
      GV: firebase.auth().currentUser.email,
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
      },
      yourClasses:{
        ...this.state.yourClasses,
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

  handleCancelCreateEvent = (e) => {
    const form = this.form3;
    form.resetFields();
    this.setState({
      visiblePopupCreateEvent: false,
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

  saveFormRef3 = (form3) => {
    this.form3 = form3;
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
    if (value && _.some(this.state.classes, { 'NhomMH': nhom, 'ToMH': to, 'MaMH': maMH })) {
      callback(`Group ${nhom} team ${to} is already exists in this subject `)
    }
    callback()
  }

  handleExportXls = () => {
    const data_type = 'data:application/vnd.ms-excel';
    const table_div = document.getElementById('table_wrapper');
    const table_html = table_div.outerHTML.replace(/ /g, '%20');

    let a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'attendance_tracking_' + this.state.currentSubjectName + '_' + this.state.currentClass.MaMH + '_nhom'
      + this.state.currentClass.NhomMH + '_to_' + this.state.currentClass.ToMH + '.xls';
    a.click();
  }

  confirm = (e)=> {
        if(_.isNil(this.state.currentClass.tenSuKien)) {
            update(`Lop/${this.state.selectedClass}`,null)
            this.setState({
              classes: _.reject(this.state.classes,['key',this.state.selectedClass]),
              currentClass: undefined,
              selectedClass: undefined
            })
        }
        else {
            update(`SuKien/${this.state.selectedClass}`,null)
            this.setState({
              events: _.reject(this.state.events,['key',this.state.selectedClass]),
              currentClass: undefined,
              selectedClass: undefined
            })
        }
    message.success('Deleted');
    }

    cancel = (e)=> {
    }
  componentWillMount() {
    
  }

  componentDidMount() {
    if(_.isNil(firebase.auth().currentUser)){
      this.setState({loading:false})
    }
    
    Promise.all([getData('MonHoc'), getData('Lop'), getData('DiemDanh'), getData('SuKien'),getData('GiangVien')])
      .then(([subjects, classes, diemdanh, events, listGiangVien]) => this.setState({
        subjects,
        classes: filterUndifinedObjects(classes),
        diemdanh: filterUndifinedObjects(diemdanh),
        events: filterUndifinedObjects(events),
        yourEvents: _.filter(filterUndifinedObjects(events),['GV',firebase.auth().currentUser.email]),
        listGiangVien: filterUndifinedObjects(listGiangVien),
        yourClasses: _.filter(filterUndifinedObjects(classes),['GV',firebase.auth().currentUser.email]),
        loading: false
      }));
  } 

  render() {  
    if (this.state.loading) return <Loading />;
    if (_.isNil(firebase.auth().currentUser) || !firebase.auth().currentUser.emailVerified)
      return <Forbidden />;
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#f7f7f7', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={6}>
              <img alt='logo' src={logo} style={{ height: 70, padding: 7 }} />
            </Col>
            <Col span={12}>
              <Button type='primary' onClick={this.showModalCreateSubject} style={{ height: 40, fontSize: 15 }}><Icon type="plus-circle-o" style={{ fontSize: 18 }} />Add subject</Button>
              
              <Button type='primary' onClick={this.showModalCreateClass} style={{ height: 40, fontSize: 15, marginLeft: 20 }}><Icon type="plus-circle-o" style={{ fontSize: 18 }} />Add Class</Button>
              <Button type='primary' onClick={this.showModalCreateEvent} style={{ height: 40, fontSize: 15,  marginLeft: 20 }}><Icon type="plus-circle-o" style={{ fontSize: 18 }} />Add Event</Button>
              <CreateSubjectForm
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleSaveSubject}
                handleUniqueCode={this.handleUniqueCode}
              />

              <CreateEventForm
                ref={this.saveFormRef3}
                visible={this.state.visiblePopupCreateEvent}
                onCancel={this.handleCancelCreateEvent}
                onCreate={this.handleSaveEvent}
              />

              <CreateClassForm
                ref={this.saveForm2Ref}
                visible={this.state.visiblePopupCreateClass}
                onCancelCreateClass={this.onCancel}
                onCreateClass={this.handleSaveClass}
                subjects={this.state.subjects}
                validateGroupAndTeam={this.validateGroupAndTeam}
                listGiangVien = {this.state.listGiangVien}
              />
            </Col>
            
            <Col span={6}>             
              <Dropdown overlay={profileMenu}>
                <img alt='user' src={user} style={{ height: 70, padding: 7,marginLeft:100 }} />
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
                      _.map(_.filter(_.includes(this.admin,firebase.auth().currentUser.email)?this.state.classes:this.state.yourClasses, ['MaMH', subject.MaMH]), (lop) => <Menu.Item key={lop.key}>Nhóm {lop.NhomMH} Tổ {lop.ToMH}</Menu.Item>)
                    }
                  </SubMenu>)
                }
              </SubMenu>
              <SubMenu
                key="event"
                title={<span><Icon type="flag" /><span className="nav-text">Events </span></span>}
              >
                {
                  _.map(_.includes(this.admin,firebase.auth().currentUser.email)?this.state.events:this.state.yourEvents, (event) => <Menu.Item key={'event'+event.key}> {event.tenSuKien}
                  </Menu.Item>)
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
            {
              _.isObject(this.state.currentClass)?
                <Row type='flex' style={{ height: '100%' }} >
                    {
                        _.isNil(this.state.currentClass.tenSuKien)?
                        <label style={{ fontSize: 25 }}>{this.state.currentSubjectName} nhóm {this.state.currentClass.NhomMH} tổ {this.state.currentClass.ToMH}</label>
                        :
                        <label style={{ fontSize: 25 }}>{this.state.currentClass.tenSuKien} - {this.state.currentClass.diaDiem}</label>
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
                :null
            }
            

              <Row>
                {
                  _.isNil(this.state.selectedClass) ? null :
                    <div>
                      <Attendance diemdanh={this.state.diemdanh} maLop={this.state.selectedClass} currentClass={this.state.currentClass} />
                      <Row type='flex' justify='center'>                  
                        <Button onClick={() => this.handleExportXls()} >Export to xls</Button>
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
