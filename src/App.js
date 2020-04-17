import React, {useState} from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Search from './Components/Search/Search';
import Details from './Components/addressDetails/addressDetails';
import Maps from './Components/Map/maps'

import CodeContext from './Context/code-context';
import StartContext from './Context/start-context';

const App = ()=> {
  const [codeStatus, setcodeStatus] = useState({});
  const [startStat, setStartStat] = useState({});

   const updateCodeStatus = (data) =>{
    setcodeStatus(data)
   }

   const setStartStatus = (data) =>{
    setStartStat(data)
   }

  let routes = (
    <Switch>
      <Route path="/maps" exact component={Maps}/>
     <Route path="/details" exact component={Details}/>
     <Route path="/" component={Search} />
     <Redirect to="/" /> 
    </Switch>);

  return (
   
      <div className="App">
      <CodeContext.Provider value={{eircode: codeStatus, codeStatus: updateCodeStatus}}> 
      <StartContext.Provider value={{startLocation: startStat, startStatus: setStartStatus}}>
        {routes}
      </StartContext.Provider>
      </CodeContext.Provider>  
      </div>
      
    );
}

export default withRouter(App);