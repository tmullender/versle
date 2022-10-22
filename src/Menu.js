import {MdHelp, MdLeaderboard, MdSettings} from "react-icons/md";
import './Menu.css'
import {Modal} from "react-bootstrap";
import {useState} from "react";
import Statistics from "./Statistics";

function Menu(props) {
    const [showHelp, setShowHelp] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showStatistics, setShowStatistics] = useState(false)

    const verseOfTheDayLabel = props.settings.randomVerse ?
        <label htmlFor={"random"}>Using a random verse (untick to use the Verse of the Day)</label> :
        <label htmlFor={"random"}>Using Verse of the Day (tick to use a random verse)</label>

    const hideStatistics = () => {
        setShowStatistics(false);
        props.hideStatistics()
    }

    return(
        <>
            <div className={"Menu"}>
                <MdHelp title={"Help"} className={"menuIcon help"} onClick={() => setShowHelp(true)}/>
                <h2 className={"title"}>Versle</h2>
                <MdLeaderboard title={"Statistics"} className={"menuIcon statistics"} onClick={() => setShowStatistics(true)}/>
                <MdSettings title={"Settings"} className={"menuIcon settings"} onClick={() => setShowSettings(true)}/>
            </div>
            <Modal show={showHelp} onHide={() => setShowHelp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>How to Play</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The words from a verse in the Bible have been reordered into alphabetical order.</p>
                    <p>Each box represents a word from the verse.  <b>Click</b>, <b>tap</b> or <b>drag</b> a word
                        to put it into a box. <b>Click</b> or <b>tap</b> a word in a box to remove it.</p>
                    <p>When all the boxes contain a word they will change colour: green, if the word is in the
                        correct place, or red if it is in the wrong place.</p>
                    <p>You can have as many goes as you want in order to complete the verse.  When you complete the
                        verse correctly the verse's location will be displayed as a link so you can read the chapter.
                    </p>
                </Modal.Body>
            </Modal>
            <Modal show={showSettings} onHide={() => setShowSettings(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"setting"}>
                        {verseOfTheDayLabel}
                        <input
                            name={"random"}
                            type={"checkbox"}
                            checked={props.settings.randomVerse}
                            onChange={() => props.update({...props.settings, randomVerse:!props.settings.randomVerse})}
                        />
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showStatistics || props.statistics.visible} onHide={hideStatistics}>
                <Modal.Header closeButton>
                    <Modal.Title>Statistics</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Statistics statistics={props.statistics}/>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Menu;