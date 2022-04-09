function Space(props) {
    function drop(event) {
        event.preventDefault();
        if (!props.word.value) {
            props.onUpdate(props.word.position, parseInt(event.dataTransfer.getData("index")));
        }
    }

    const success = props.complete ? props.word.correct ? "correct" : "incorrect" : ""
    return (
        <div className={`Space ${success}`} onClick={props.onClick} onDrop={drop}
             onDragOver={(e) => e.preventDefault()}>
            <span>{props.word.value}</span>
        </div>
    )
}

export function Solution(props) {
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