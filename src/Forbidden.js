import React from 'react';
import logoOnly from './logo_only.png';
import police from './No.png';
export default () =>
  <div style={{
      marginTop:'50'
    }}>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1 1 auto',
      height: '100%'
    }}>
      <img alt='police' src={police} style={{ width: '200', height: '200' }} />
    </div>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1 1 auto',
      height: '100%'
    }}>
      <font size="10" color="red">ERROR 403-FORBIDDEN!</font>
    </div>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1 1 auto',
      height: '100%'
    }}>
      <font size="4" color="#600a0a">Sorry, you don't have permission to access to the page you requested.</font>
    </div>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1 1 auto',
      height: '100%'
    }}>
      <font size="4" color="#600a0a">You can <a href="/#/signin"> Signin</a> to or back to <a href="/"> Seach page</a>. </font>
    </div>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '1 1 auto',
      height: '100%'
    }}>
      <img alt='loading logo' src={logoOnly} className='App-logo' />
    </div >
  </div>