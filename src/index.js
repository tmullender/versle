import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <div className={"footer"}>
        <div>The Scriptures quoted are from the NET Bible®
            <a href={"http://netbible.com"}>http://netbible.com</a>
            copyright ©1996, 2019 used with permission from Biblical Studies Press, L.L.C. All rights reserved
        </div>
        <div>Inspired by <a href={"https://www.nytimes.com/games/wordle/"}>Wordle</a></div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

