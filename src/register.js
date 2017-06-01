import React, { Component } from 'react'
import './ant.css'
import firebase from './firebase'
import { Form, Input, Tooltip, Icon, Card, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const password = 'Admin@123';
                firebase.auth().createUserWithEmailAndPassword(values.email, password).catch(function (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.');
                    } else {
                        alert(errorMessage);
                    }
                });
            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };

        return (
            <div style={{ padding: '30px' }}>
                <Card title="Register" style={{ width: '50%' }}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="E-mail"
                            hasFeedback
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: 'The input is not valid E-mail!',
                                }, {
                                    required: true, message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} />
                                )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                    Name&nbsp;
              <Tooltip title="Your full name?">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                            hasFeedback
                        >
                            {getFieldDecorator('fullname', {
                                rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} />
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Captcha"
                            extra="We must make sure that your are a human."
                        >
                            <Row gutter={8}>
                                <Col span={12}>
                                    {getFieldDecorator('captcha', {
                                        rules: [{ required: true, message: 'Please input the captcha you got!' }],
                                    })(
                                        <Input size="large" />
                                        )}
                                </Col>
                                <Col span={12}>
                                    <Button size="large">Get captcha</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                            {getFieldDecorator('agreement', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>I have read the <a href="">agreement</a></Checkbox>
                                )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">Register</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default RegistrationForm