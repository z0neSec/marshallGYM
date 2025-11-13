import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/theme.css';
import logo from './images/marshall_logo.png';

function setFavicon(iconUrl) {
  try {
    const head = document.getElementsByTagName('head')[0];
    let link = head.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = iconUrl;
  } catch (err) {
    console.error('Failed to set favicon', err);
  }
}

setFavicon(logo);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);