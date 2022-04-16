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

function loadStatistics() {
    const statistics = localStorage.getItem("statistics");
    if (statistics) {
        return JSON.parse(statistics);
    }
    return {
        played: 0,
        distribution: [0,0,0,0,0,0],
        currentStreak: 0,
        longestStreak: 0
    }
}

function App() {
    const [settings, setSettings] = useState(loadSettings());
    const [statistics, setStatistics] = useState(loadStatistics());

    function updateSettings(settings) {
        localStorage.setItem("settings", JSON.stringify(settings))
        setSettings(settings)
    }

    function onGameComplete(count) {
        const distribution = statistics.distribution;
        distribution[count - 1] = distribution[count - 1] + 1
        const currentStreak = statistics.currentStreak + 1;
        const updated = {...statistics,
            distribution,
            played: statistics.played + 1,
            currentStreak,
            longestStreak: Math.max(currentStreak, statistics.longestStreak)
        };
        localStorage.setItem("statistics", JSON.stringify(updated))
        setStatistics(updated)
    }

    function onGameStarted() {
        const updated = { ...statistics, played: statistics.played + 1, currentStreak: 0 };
        localStorage.setItem("statistics", JSON.stringify(updated))
        setStatistics(updated)
    }

    return (
        <div className={"App"} >
            <Menu settings={settings} update={updateSettings} statistics={statistics}/>
            <Game settings={settings} onComplete={onGameComplete} onNewGame={onGameStarted}/>
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