import { Form, Icon, Input, Button, Checkbox, Alert, Card} from 'antd'
import React, { Component } from 'react'
import firebase from './firebase'
import _ from 'lodash'
const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
            haveErrors: null,
            loading: false
        }
    }

  
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({haveErrors: null, loading:true}) 
    this.props.form.validateFields((err, values) => {
      if (!err) {
        firebase.auth().signInWithEmailAndPassword(values.email, values.password).catch((error)=> {
          if(error){         
            this.setState({
              haveErrors: true,
              message: error.message,
              loading: false
            })
            return 
          }         
        }).then(()=>
        {
          if(_.isNil(this.state.haveErrors)){
            if(firebase.auth().currentUser.emailVerified){
              window.location.replace('/#/home')
            } else{
              this.setState({
                haveErrors: true,
                message: 'This account still not activated, please check your mail and activate it',
                loading: false 
              })
            }
            
          }})
        
            
      }
      else{
        this.setState({loading:false})
      }
    });
  }
  render() {
    {
      if(firebase.auth().currentUser){
              window.location.replace('/#/home')
      } 
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ paddingTop:'120' }}>
      <Card title="Login" style={{ width: '30%', margin:'0 auto'}}>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Email"/>
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
          <Button style={{width: '100%'}} type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading}>
            Log in
          </Button>
            <br/>
            Or
            <a href="/#/register"> register now!</a>
        </FormItem>
        {
          (_.isNil(this.state.haveErrors))?null:
          <Alert
          message="Error"
          description={this.state.message}
          type="error"
          showIcon
          closable
          />
        }
              
      </Form>
      </Card>
      </div>
    );
  }
}

export default LoginForm

