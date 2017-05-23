import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Icon, Row, Col, Button, Input, Modal, InputNumber, Switch, Select } from 'antd';
import Loading from './Loading';
import './App.css';
import logo from './logo.png';
import user from './user.png';
import { getData, update, getLastIndex } from './firebase';

const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;

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
    Promise.all([getData('MonHoc'), getData('Lop')])
      .then(([subjects, classes]) => this.setState({
        subjects,
        classes,
        selectedSubject: _.first(subjects),
        loading: false
      }));
  }
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }
  onSelectSubject = (e) => {
    this.setState({
      selectedSubject: e.key,
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

  handleSaveSubject = (e) => {
    getLastIndex(`MonHoc`).then((lastIndex) => this.addNewSubject(lastIndex))
    this.setState({
      visible: false,
    });
  }

  addNewSubject = (lastIndex) => {
    let newIndex = parseInt(lastIndex) + 1
    let newSubject = {
      MaMH: this.state.newSubjectCode,
      TenMH: this.state.newSubjectName
    }
    update(`MonHoc/${newIndex}`, newSubject)
    this.setState({
      newSubjectCode: null,
      newSubjectName: null,
      subjects: {
        ...this.state.subjects,
        [newIndex]: newSubject
      }
    });
  }

  handleSaveClass = (e) => {
    this.setState({
      visible: false,
    });
  }

  addNewClass = (lastIndex) => {
    let newIndex = parseInt(lastIndex) + 1
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  onCancel = (e) => {
    this.setState({
      visiblePopupCreateClass: false,
    });

  }

  handleChangeSubjectCode = (e) => {
    this.setState({ newSubjectCode: e.target.value })
  }

  handleChangeSubjectName = (e) => {
    this.setState({ newSubjectName: e.target.value })
  }

  handleChangeProgram = (checked) => {
    this.setState({ top100: checked })
  }

  handleChangeHocKy = (value) => {
    this.setState({ hocKy: value })
  }

  handleNamHoc = (e) => {
    this.setState({ namHoc: e.target.value})
  }

  handleChangeMonHoc = (value) => {
    this.setState({ monHoc: value })
  }

  handleChangeGiangVien = (value) => {
    this.setState({ giangVien: value })
  }

  handleChangeNhom = (value) => {
    this.setState({ nhom: value })
  }

  handleChangeTo = (value) => {
    this.setState({ to: value })
  }

  render() {
    if (this.state.loading) return <Loading />;
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 70, padding: 7 }} />
            </Col>
            <Col style={{ paddingRight: 20 }}>
              <img alt='user' src={user} style={{ height: 70, padding: 7 }} />
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
              onClick={this.onSelectProfile}
              selectedKeys={[this.state.selectedProfile]}
              inlineIndent={10}
            >
              <SubMenu
                key="sub1"
                title={<span><Icon type="star" /><span className="nav-text">Subjects</span></span>}
              >
                {
                  _.map(this.state.subjects, (subject) => <SubMenu key={subject.MaMH} title={<span>{subject.TenMH}</span>}>
                    {
                      _.map(_.filter(this.state.classes, ['MaMH', subject.MaMH]), (lop) => <Menu.Item key={lop.key}>Nhóm {lop.NhomMH} Tổ {lop.ToMH}</Menu.Item>)
                    }
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
              <Col>
                <Button type='primary' onClick={this.showModalCreateSubject} style={{ height: 40, fontSize: 14 }}>Add new subject</Button>
                <Modal title="Create new subject" visible={this.state.visible}
                  onOk={this.handleSaveSubject} onCancel={this.handleCancel}
                >
                  <div style={{ marginBottom: 16 }}>
                    <Input placeholder='Subject code' value={this.state.newSubjectCode} onChange={this.handleChangeSubjectCode} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <Input placeholder='Subject name' value={this.state.newSubjectName} onChange={this.handleChangeSubjectName} />
                  </div>

                </Modal>
              </Col>
              <Col>
                <Button type='primary' onClick={this.showModalCreateClass} style={{ height: 40, fontSize: 14 }}>Add new class</Button>
                <Modal title="Create new class" visible={this.state.visiblePopupCreateClass}
                  onOk={this.handleSaveClass} onCancel={this.onCancel}
                >
                  <Row type='flex' justify='space-between' style={{ height: '100%' }}>
                    <Col>
                      <div style={{ marginBottom: 16 }}>
                        <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} onChange={this.handleChangeProgram}/> Top 100 program
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Select defaultValue="HKI" style={{ width: 120 }} onChange={this.handleChangeHocKy}>
                          <Option value="HK1">Học kỳ 1</Option>
                          <Option value="HK2">Học kỳ 2</Option>
                          <Option value="HK3">Học kỳ hè</Option>
                          <Option value="HKDT1">Học kỳ dự thính 1</Option>
                          <Option value="HKDT2">Học kỳ dự thính 2</Option>
                          <Option value="other">Khác...</Option>
                        </Select>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Input placeholder="Nhập năm học" style={{ width: 215 }} onChange={this.handleNamHoc}/>
                      </div>
                    </Col>
                    <Col>
                      <div style={{ marginBottom: 16 }}>
                        <Select defaultValue="Chọn một môn học" style={{ width: 215 }} onChange={this.handleChangeMonHoc}>
                          {
                            _.map(this.state.subjects, (subject) => <Option value={subject.MaMH}>{subject.TenMH}</Option>)
                          }
                        </Select>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Select defaultValue="Chọn một giảng viên" style={{ width: 215 }} onChange={this.handleChangeGiangVien}>
                          <Option value="0">Nguyễn Văn A</Option>
                          <Option value="1">Nguyễn Văn B</Option>
                          <Option value="2">Trần Thị C</Option>
                        </Select>
                      </div>                     
                      <div style={{ marginBottom: 16 }}>
                        Nhóm <InputNumber min={1} defaultValue={1} onChange={this.handleChangeNhom} /> Tổ <InputNumber min={1} defaultValue={1} onChange={this.handleChangeTo}/>
                      </div>
                    </Col>
                  </Row>
                </Modal>
              </Col>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default MainPage;
