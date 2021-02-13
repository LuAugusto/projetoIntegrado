import React from 'react';
import {Switch,Route} from 'react-router-dom';

import Home from './Components/Home';
import Empresa from './Components/Empresa';

export default function Routes(){
  return(
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/empresa" component={Empresa}/>
    </Switch>
  );
}