import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { StyleWrapper } from '@sprice237/accounting-ui';

import { App } from '$cmp/App';

ReactDOM.render(
  <StrictMode>
    <StyleWrapper>
      <Router>
        <App />
      </Router>
    </StyleWrapper>
  </StrictMode>,
  document.getElementById('root')
);
