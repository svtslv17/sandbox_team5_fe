import './App.scss';
import React from 'react';
import { BrowserRouter as Router, useLocation, Route, Switch } from 'react-router-dom';

function App() {
  const location = useLocation();
  return (
    <Router> 
      <Switch location={location}>
            <Route exact path="/">
           {/* the name of page  */}
            </Route>
          </Switch>
    </Router>
 
  );
}

export default App;
