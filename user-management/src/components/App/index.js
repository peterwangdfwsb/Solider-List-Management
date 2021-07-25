import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CreateUser from '../createuser';
import EditUser from '../edituser';
import HomePage from '../homepage';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/createuser' component={CreateUser} />
          <Route path='/edituser/:userId' component={EditUser} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
