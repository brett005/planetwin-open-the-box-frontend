import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import style from './index.scss';
import Config from './config';

ReactDOM.render(
  <App className={style.app} />,
  document.querySelector('.thunderbite-game')
);
