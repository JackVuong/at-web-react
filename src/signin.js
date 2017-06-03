import { Form, Icon, Input, Button, Checkbox } from 'antd'
import React, { Component } from 'react'
import firebase from './firebase'
import _ from 'lodash'
const FormItem = Form.Item;

class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        firebase.auth().signInWithEmailAndPassword(values.email, values.password).catch(function(error) {
          alert(error.message)        
        });
        console.log(firebase.auth().currentUser)

      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" layout="inline">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          <a style={{ marginLeft: 10 }} href="/#/register"> Register now!</a>
        </FormItem>
      </Form>
    );
  }
}

export default LoginForm

