import React, {useEffect, useState} from 'react';
import './App.css';

function sortValues(a, b) {
    const x = a.value.toLowerCase();
    const y = b.value.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

function Word(props) {
    function drag(event) {
        event.dataTransfer.setData("index", props.word.index);
    }
    function onClick() {
        if (props.word.available) {
            props.onClick(props.word.index)
        }
    }
    const available = props.word.available ? "available": ""
    return (
        <div
            className={`Word ${available}`}
            draggable={props.word.available}
            onDragStart={drag}
            onClick={onClick}
        >
            <span>{props.word.value}</span>
        </div>
    )
}

function WordList(props) {
    const list = [...props.words].sort(sortValues).map(word =>
        <Word key={word.index} word={word} draggable={true} onClick={props.wordSelected}/>
    )
    return (
        <div className={"WordList"}>
            {list}
        </div>
    )
}

function Space(props) {
    function drop(event) {
        event.preventDefault();
        if (!props.word.value) {
            props.onUpdate(props.word.position, parseInt(event.dataTransfer.getData("index")));
        }
    }
    const success = props.complete ? props.word.correct ? "correct" : "incorrect" : ""
    return (
        <div className={`Space ${success}`} onClick={props.onClick} onDrop={drop} onDragOver={(e) => e.preventDefault()}>
            <span>{props.word.value}</span>
        </div>
    )
}

function Solution(props) {
    let spaces = props.spaces.map(space =>
        <Space
            complete={props.complete}
            key={space.position}
            onClick={() => !props.complete && props.spaceClicked(space)}
            onUpdate={props.onUpdate}
            word={space}
        />
    )
    return (
        <div className={"Solution"}>
            {spaces}
        </div>
    )
}

function App() {
    const [ words, setWords ] = useState({ available: [], used: [] });
    const [ location, setLocation ] = useState("");
    const [ history, setHistory] = useState([]);
    const [ nextIndex, setNextIndex ] = useState(0);

    function initialise(words, location) {
        const used = words.map((value, position) => {
            return {position}
        });
        const available = words.map((value, index) => {
            return {value, index, available: true}
        });
        setWords({available, used, complete: false});
        setLocation(location);
        setNextIndex(0);
        setHistory([]);
    }

    useEffect(() => {
        fetch("https://labs.bible.org/api/?passage=random&type=json")
            .then(response => response.json())
            .then(json => {
                const verse = json[0]
                const words = verse.text.split(" ").filter(word => word.length);
                initialise(words, `${verse.bookname} ${verse.chapter}v${verse.verse}`);
            })
            .catch(err => {
                console.log(err);
                initialise(["There", "was", "a", "problem", "selecting", "a", "verse"], "Well Done");
            });
    }, []);

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
        if (complete && used.some(word => !word.correct)) {
            setHistory([...history, {available, used, complete}])
            setWords({
                available: available.map(word => {word.available = true; return word}),
                used: available.map((word, position) => { return {position} }),
                complete: false
            })
            return true;
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

    const success = words.used.every(word => word.correct)
    return (
        <div className="App">
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
            <span className={"location"}>{success ? location : ""}</span>
            <WordList words={words.available} wordSelected={wordSelected}/>
        </div>
    );
}

export default App;
