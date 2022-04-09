function sortValues(a, b) {
    const x = a.value.toLowerCase();
    const y = b.value.toLowerCase();
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
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

    const available = props.word.available ? "available" : ""
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

export function WordList(props) {
    const list = [...props.words].sort(sortValues).map(word =>
        <Word key={word.index} word={word} draggable={true} onClick={props.wordSelected}/>
    )
    return (
        <div className={"WordList"}>
            {list}
        </div>
    )
}