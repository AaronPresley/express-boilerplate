import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

const App: React.FunctionComponent<{}> = (): JSX.Element => (
  <Switch>
    <Route component={(): JSX.Element => <>Hi</>} />
  </Switch>
);

export default App;
