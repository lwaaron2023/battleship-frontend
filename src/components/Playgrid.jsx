import Row from "./Row.jsx";
import React, {useEffect, useState} from "react";


const Playgrid = (props)=>{
    const [rows, setRows] = React.useState([]);
    let [turn, setTurn] = useState(false);
    let [waitingForReply, setWaitingForReply] = useState(false);
    useEffect(()=>{
        if(props.playmode){
            const container = document.getElementById("playfield");
            if(container){
                container.classList.remove("hidden");
            }
            const rowValues = [];
            const numRows = props.rows;
            const numCols = props.cols;
            for (let i = 0; i < numRows; i += 1) {
                rowValues.push(<Row row={i} cols={numCols} size={props.size} id={props.id} key={`row:${i}`}/>)
            }
            //Number of ships to place, used in calculations for spacing
            setRows(rowValues);
            //allows dynamic columns
        }
    },[props.playmode])

    useEffect(()=>{
        const a = props.attacking
        setTurn(a);
    },[props.attacking])

    useEffect(()=>{
        const r = props.waitingForReply;
        setWaitingForReply(r);
        waitingForReply = props.waitingForReply;
    }, [waitingForReply])

    const handleClick = (e) => {
        // console.log(turn,waitingForReply)
        const [t,r] = [turn, waitingForReply];
        if(t && !r) {
            const info = props.extractInfo(e.target.id);
            if (info.row <= 0 || info.col <= 0) {
                const message = document.getElementById("message");
                if (message) {
                    message.classList.add("text-red-500");
                    message.innerText = "Invalid target selected";
                    setInterval(() => {
                        message.classList.remove("text-red-500");
                        message.innerText = "";
                    }, 10000)
                }
            }
            else{
                const tile = document.getElementById(`${props.id}:${info.row}:${info.col}`);
                if(tile){
                    // console.log(tile);
                    if(tile.classList.contains("bg-gray-200")){
                        props.attack(info.row, info.col);
                    }
                    else{
                        const message = document.getElementById("message");
                        if (message) {
                            message.classList.add("text-red-500");
                            message.innerText = "Invalid target selected, already attacked here";
                            setInterval(() => {
                                message.classList.remove("text-red-500");
                                message.innerText = "";
                            }, 10000)
                        }
                    }

                }

            }
        }
    }

    return (
        <>
            <div className={"flex flex-col mb-10 hover:cursor-crosshair"} id={props.id} key={`${props.id}`} onClick={handleClick}>
                {rows}
            </div>
        </>
    )
}

export default Playgrid
