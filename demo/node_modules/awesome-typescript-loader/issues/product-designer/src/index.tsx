import 'reflect-metadata';
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotReloadContainer } from 'react-hot-loader';

import { useStrict } from 'mobx';

import { App } from './components/App';

useStrict(true);

const rootElement = document.getElementById('container') as Element;

render(
  <HotReloadContainer>
    <App />
  </HotReloadContainer>,
  rootElement
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const nextApp = (require('./components/App') as any).App as new (props: any) => App;
    render(
      <HotReloadContainer>
        {React.createElement(nextApp)}
      </HotReloadContainer>,
      rootElement
    );
  });
}
