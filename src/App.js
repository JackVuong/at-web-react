import React, { Component } from 'react';
import { LocaleProvider,Form } from 'antd';
import _ from 'lodash';
import Router from 'react-router-component';
import enUS from 'antd/lib/locale-provider/en_US';
import MainPage from './MainPage';
import RegistrationForm from './register';
import LoginForm from './signin'
import './App.css';
import SeachPage from './search'

const Locations = Router.Locations;
const Location = Router.Location;
const WrappedRegistrationForm = Form.create()(RegistrationForm)
const WrappedLoginForm = Form.create()(LoginForm)
class App extends Component {
  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Locations hash style={{height: '100%'}}>
          <Location path='/' handler={SeachPage} />
          <Location path='/home' handler={MainPage} />
          <Location path='/register' handler={WrappedRegistrationForm} />
          <Location path='/signin' handler={WrappedLoginForm} />
        </Locations>
      </LocaleProvider>
    );
  }
}

export default App;
