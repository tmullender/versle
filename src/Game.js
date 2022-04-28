import {useEffect, useState} from 'react';
import './Game.css';
import BOOK_KEYS from './bookKeys.json'
import {WordList} from "./WordList";
import {Solution} from "./Solution";


function Game(props) {
    const [ words, setWords ] = useState({ available: [], used: [] });
    const [ location, setLocation ] = useState("");
    const [ history, setHistory] = useState([]);
    const [ nextIndex, setNextIndex ] = useState(0);

    const passage = props.settings.randomVerse ? "random" : "votd";

    function loadGame(game, available) {
        const savedHistory = game.history.map(item => {
            return {
                used: item.map((savedIndex, index) => {
                    return { ...available[savedIndex], position: index, correct: available[savedIndex].value === available[index].value }
                })
            }
        });
        if (game.complete) {
            const solution = savedHistory.splice(-1)
            available.forEach(word => word.available = false)
            setWords({ available, used:solution[0].used, complete: true})
        }
        setHistory(savedHistory);
    }

    function loadSavedGame() {
        const saved = localStorage.getItem("game");
        if (saved) {
            return JSON.parse(saved);
        }
        return { history: [] };
    }

    function getGameKey(location) {
        return `${(getBookKey(location))}${location.chapter}V${location.verse}`;
    }

    function initialise(words, location) {
        const game = loadSavedGame()
        const key = getGameKey(location);
        const available = words.map((value, index) => {
            return {value, index, available: true}
        });
        const used = words.map((value, position) => {
            return {position}
        });
        setWords({available, used, complete: false});
        setLocation(location);
        setNextIndex(0);
        if (game.key === key) {
            loadGame(game, available)
        } else {
            setHistory([]);
            if (game.key && !game.complete) {
                props.onNewGame()
            }
        }
    }

    function fetchVerse() {
        fetch(`https://labs.bible.org/api/?passage=${passage}&type=json&formatting=plain`)
            .then(response => response.json())
            .then(json => {
                const verse = json[0]
                const words = verse.text.split(" ").filter(word => word.length);
                initialise(words, verse);
            })
            .catch(err => {
                console.log(err);
                initialise(["There", "was", "a", "problem", "selecting", "a", "verse"], { bookname: "ABC", chapter: 0, verse: 0 });
            });
    }

    useEffect(fetchVerse, []);

    function saveHistory(updated, complete) {
        const saved = updated.map(item => item.used.map(word => word.index))
        localStorage.setItem("game", JSON.stringify({key: getGameKey(location), history: saved, complete}))
    }

    function onUpdate(target, source) {
        let complete = true;
        const used = words.used.map((space, index) => {
            if (index === target) {
                space = {...space, ...words.available[source]};
            }
            if (!space.value) {
                complete = false;
            }
            if (space.index === index || space.value === words.available[index].value) {
                space.correct = true;
            }
            return space;
        })
        const available = words.available.map(word => {
            if (word.index === source) {
                word.available = false;
            }
            return word;
        })
        const updated = [...history, {available, used, complete}];
        if (complete && used.some(word => !word.correct)) {
            saveHistory(updated, false)
            setHistory(updated)
            const correctIndexes = used.filter(word => word.correct).map(word => word.index);
            setWords({
                available: available.map(word => {word.available = !correctIndexes.includes(word.index); return word}),
                used: used.map((word, position) => { return word.correct ? word : {position} }),
                complete: false
            })
            return true;
        } else if (complete) {
            saveHistory(updated, true)
            props.onComplete(updated.length)
        }
        setWords({available, used, complete})
        return false;
    }

    function wordSelected(index) {
        let current = nextIndex;
        while (words.used[current].value) {
            current++
        }
        if (onUpdate(current, index)) {
            setNextIndex(0)
        } else {
            setNextIndex(++current);
        }
    }

    function spaceClicked(space) {
        if (space.value) {
            const used = words.used.map((word) => {
                if (word.position === space.position) {
                    return {position: space.position}
                }
                return word;
            })
            const available = words.available.map((word) => {
                if (word.index === space.index) {
                    return {...word, available: true}
                }
                return word;
            })
            setWords({...words, available, used})
            if (nextIndex > space.position) {
                setNextIndex(space.position)
            }
        }
    }

    function getBookKey(location) {
        const key = BOOK_KEYS[location.bookname];
        return key || location.bookname.replaceAll(" ", "").slice(0, 3).toUpperCase();
    }

    function createLocation() {
        const success = words.used.every(word => word.correct)
        if (success && location.bookname) {
            const content = `${location.bookname} ${location.chapter}v${location.verse}`;
            const key = `${(getBookKey(location))}.${location.chapter}.NET`;
            return <a className={"location"} href={`https://bible.com/en-GB/bible/107/${key}`}>{content}</a>
        } else {
            return <div className={"location"}/>
        }
    }

    return (
        <div className="Game">
            <div className={"history"} >
                {history.map((solution, index) => <Solution key={index} complete={true} spaces={solution.used} /> )}
            </div>
            <Solution
                key={history.length}
                complete={words.complete}
                spaceClicked={spaceClicked}
                onUpdate={onUpdate}
                spaces={words.used}
            />
            {createLocation()}
            <WordList words={words.available} wordSelected={wordSelected}/>
        </div>
    );
}

export default Game;