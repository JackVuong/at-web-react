import { Form, Icon, Input, Button, Modal, Switch, Select, InputNumber, Col, Row} from 'antd';
import React, { Component } from 'react';
import _ from 'lodash';
const FormItem = Form.Item;
const CreateClassForm = Form.create()(
  (props) => {
    const { visible, onCancelCreateClass, onCreateClass, form, subjects, validateGroupAndTeam, listGiangVien } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new class"
        okText="Create"
        onCancel={onCancelCreateClass}
        onOk={onCreateClass}
      >
        <Form layout="vertical">
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col>
          <FormItem>
            {getFieldDecorator('hocky',{initialValue: 'HK1'})(
              <Select style={{ width: 220 }} showSearch>
                <Option value="HK1">Học kỳ 1</Option>
                <Option value="HK2">Học kỳ 2</Option>
                <Option value="HK3">Học kỳ hè</Option>
                <Option value="HKDT1">Học kỳ dự thính 1</Option>
                <Option value="HKDT2">Học kỳ dự thính 2</Option>
                <Option value="other">Khác...</Option>
              </Select>
            )}

          </FormItem>
          <FormItem>
            {getFieldDecorator('namhoc',{
              rules: [{ required: true, message: 'Please input year!' }]})(
              <Input placeholder="Nhập năm học" style={{ width: 220 }} />
            )}
          </FormItem>
          </Col>
          <Col>
          <FormItem>
            {getFieldDecorator('monhoc',{
              rules: [{ required: true, message: 'Please select one subject!' }]})(
              <Select placeholder="Chọn một môn học" style={{ width: 220 }} showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >

                {
                  _.map(subjects, (subject) => <Option value={subject.MaMH}>{subject.TenMH}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem>
            Nhóm
            {getFieldDecorator('nhom',{initialValue: 1,
              rules: [{ validator: validateGroupAndTeam }]})(
                <InputNumber min={1}/>
            )}
            Tổ
            {getFieldDecorator('to',{initialValue: 1,
              rules: [{ validator: validateGroupAndTeam }]})(            
                <InputNumber min={1}/>          
            )}            
          </FormItem>
          <FormItem>
            {getFieldDecorator('validate',{
              rules: [{ validator: validateGroupAndTeam }]})(
                <span/>                    
            )} 
            </FormItem>
          
          </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
);
export default CreateClassForm