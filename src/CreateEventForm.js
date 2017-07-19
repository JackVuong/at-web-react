import { Form, Icon, Input, Button, Modal } from 'antd';
import React, { Component } from 'react';
const FormItem = Form.Item;

const CreateEventForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form} = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new event"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem>
            {getFieldDecorator('eventName', {
              rules: [{ required: true, message: 'Please input event name!' }],
            })(
              <Input prefix={<Icon type="key" style={{ fontSize: 13 }} />} placeholder="Event name" />
              )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('place', {
              rules: [{ required: true, message: 'Please input the place of this event!' }],
            })(
              <Input prefix={<Icon type="book" style={{ fontSize: 13 }} />} placeholder="Where does the event take place?" />
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default CreateEventForm