import React, { Component } from 'react';
import { LocaleProvider,Form } from 'antd';
import _ from 'lodash';
import Router from 'react-router-component';
import enUS from 'antd/lib/locale-provider/en_US';
import MainPage from './MainPage';
import RegistrationForm from './register';
import './App.css';


const Locations = Router.Locations;
const Location = Router.Location;
const WrappedRegistrationForm = Form.create()(RegistrationForm)
class App extends Component {
  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Locations hash style={{height: '100%'}}>
          <Location path='/' handler={MainPage} />
          <Location path='/register' handler={WrappedRegistrationForm} />
        </Locations>
      </LocaleProvider>
    );
  }
}

export default App;
