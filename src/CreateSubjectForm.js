import { Form, Icon, Input, Button, Modal } from 'antd';
import React, { Component } from 'react';
const FormItem = Form.Item;

const CreateSubjectForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, handleUniqueCode } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new subject"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem>
            {getFieldDecorator('subjectCode', {
              rules: [{ required: true, message: 'Please input subject code!' },
              { validator: handleUniqueCode }],
            })(
              <Input prefix={<Icon type="key" style={{ fontSize: 13 }} />} placeholder="Subject code" />
              )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('subjectName', {
              rules: [{ required: true, message: 'Please input subject name!' }],
            })(
              <Input prefix={<Icon type="book" style={{ fontSize: 13 }} />} placeholder="Subject name" />
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default CreateSubjectForm