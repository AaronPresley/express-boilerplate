import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

const App:React.FunctionComponent<{}> = ():JSX.Element => (
  <div>
    <Switch>
      <Route component={() => (<p>Hello</p>)} />
    </Switch>
  </div>
);

export default App;