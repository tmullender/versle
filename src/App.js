import Game from './Game';
import Menu from './Menu';
import './App.css'
import React, {useState} from "react";

function loadSettings() {
    const settings = localStorage.getItem("settings");
    if (settings) {
        return JSON.parse(settings)
    }
    return { randomVerse: false };
}

function App() {
    const [settings, setSettings] = useState(loadSettings());

    function updateSettings(settings) {
        localStorage.setItem("settings", JSON.stringify(settings))
        setSettings(settings)
    }

    return (
        <div className={"App"} >
            <Menu settings={settings} update={updateSettings}/>
            <Game settings={settings}/>
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