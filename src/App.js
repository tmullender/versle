import Game from './Game';
import Menu from './Menu';
import './App.css'
import React from "react";

function App() {
    return (
        <div className={"App"} >
            <Menu />
            <Game/>
            <div className={"footer"}>
                <div>The Scriptures quoted are from the NET Bible®
                    <a href={"http://netbible.com"}>http://netbible.com</a>
                    copyright ©1996, 2019 used with permission from Biblical Studies Press, L.L.C. All rights reserved
                </div>
                <div>Inspired by <a href={"https://www.nytimes.com/games/wordle/"}>Wordle</a></div>
            </div>
        </div>
    )
}

export default App;