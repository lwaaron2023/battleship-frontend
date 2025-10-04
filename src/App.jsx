import Placegrid from "./components/Placegrid.jsx";
import Playgrid from "./components/Playgrid.jsx";
import React, {useEffect} from "react";




function App() {
    const rows = 8;
    const cols = 8;
    const size = 7;
    const playGridId = "playgrid";
    const placeGridId = "placegrid";
    const [playMode, setPlayMode] = React.useState(false);
    const [ws, setWs] = React.useState([]);
    const [attacking, setAttacking] = React.useState(false);
    const [waitingForReply, setWaitingForReply] = React.useState(false);
    let shipTiles = 15;
    const attack = (row,col)=>{
        setWaitingForReply(true);
        const data = {
            "user":"client",
            "row": row,
            "col": col,
            "message":"attack"
        }
        if(ws.length > 0){
            // console.log(`attacking position ${row},${col}`)
            ws[0].send(JSON.stringify(data));
        }
    }

    const initializeConnection = () =>{
        setWs([new WebSocket( 'ws://127.0.0.1:3000' )])
    }

    useEffect(() => {
        if(ws.length > 0) {
            ws[0].onopen = () => {

                ws[0].onmessage = async msg => {
                    try {
                        const pos = await JSON.parse(msg.data);
                        // console.log(pos);
                        // console.log("ship tiles left", shipTiles);
                        const user = pos["user"];
                        const row = pos["row"];
                        const col = pos["col"];
                        const message = pos["message"];
                        const resp = {
                            "user":"client",
                            "row": -1,
                            "col": -1,
                            "message":""
                        }
                        // console.log(user,row,col,message)
                        if (user === "server") {
                            if (message==="clientToMove") {
                                // console.log("can attack now")
                                setAttacking(true);
                            }
                        } else if (user === "client") {
                            if(message==="attack") {
                                // console.log(row, col);
                                const target = document.getElementById(`${placeGridId}:${row}:${col}`);
                                if (target) {
                                    if (target.classList.contains("bg-gray-200")) {
                                        resp.message = "miss"
                                        resp.row = row;
                                        resp.col = col;
                                        ws[0].send(JSON.stringify(resp));
                                        target.classList.remove("bg-gray-200")
                                        target.classList.add("bg-red-200")
                                    } else if (target.classList.contains("bg-gray-500")) {
                                        resp.message = "hit"
                                        resp.row = row;
                                        resp.col = col;
                                        ws[0].send(JSON.stringify(resp));
                                        target.classList.remove("bg-gray-500")
                                        target.classList.add("bg-red-500")
                                    } else {
                                        resp.message = "miss"
                                        ws[0].send(JSON.stringify(resp));
                                    }
                                }
                            }
                            else if (message === 'miss') {
                                const target = document.getElementById(`${playGridId}:${row}:${col}`);
                                if (target) {
                                    target.classList.remove("bg-gray-200");
                                    target.classList.add("bg-black")
                                }
                                setAttacking(false);
                                setWaitingForReply(false);
                                resp.message = "received"
                                ws[0].send(JSON.stringify(resp));
                            }
                            else if (message === 'hit') {
                                const target = document.getElementById(`${playGridId}:${row}:${col}`);
                                if (target) {
                                    shipTiles -= 1;
                                    target.classList.remove("bg-gray-200");
                                    target.classList.add("bg-red-500")
                                }
                                if(shipTiles > 0){
                                    setWaitingForReply(false);
                                }
                                else{
                                    resp.message = "loss"
                                    ws[0].send(JSON.stringify(resp));
                                    const game = document.getElementById("game");
                                    if(game){
                                        game.remove();
                                        const postGame = document.getElementById("post-game");
                                        const postMessage = document.getElementById("post-game-message");
                                        if(postGame && postMessage){
                                            postMessage.innerHTML = "You Win!";
                                            postMessage.classList.add("bg-yellow-200");
                                            postGame.classList.remove("hidden");
                                        }
                                    }

                                }
                            }
                            else if (message === 'received') {
                                setAttacking(true);
                            }
                            else if(message === 'loss'){
                                const game = document.getElementById("game");
                                if(game){
                                    game.remove();
                                    const postGame = document.getElementById("post-game");
                                    const postMessage = document.getElementById("post-game-message");
                                    if(postGame && postMessage){
                                        postMessage.innerHTML = "You Lose";
                                        postMessage.classList.add("bg-red-200");
                                        postGame.classList.remove("hidden");
                                    }
                                }
                            }
                            else {
                                console.log("unknown message", user, message);
                            }
                            setWaitingForReply(false);
                        } else {
                            console.log("unknown message", user, message);
                        }
                    } catch (error) {
                        console.log(error);
                    }

                }
            }
        }
    }, [ws])

    useEffect(()=>{
        const pm = playMode
        if(pm){
            initializeConnection();
        }
    },[playMode])

    const extractInfo= (id)=>{
        const temp = id.split(":");
        temp.splice(0,1);
        const rtr = {
            "row":-1,
            "col":-1
        }
        if(temp.length === 2) {
            rtr.row = parseInt(temp[0]);
            rtr.col = parseInt(temp[1]);
        }
        return rtr;
    }
  return (
    <>

        <div className = "min-h-fit max-h-min min-w-fit max-w-fit justify-self-center m-10 p-10 bg-gray-300" id={"game"}>
            <div>
                <p className={"p-2 text-center  text-4xl"} id={"message"}></p>
            </div>
            <div className={"hidden min-h-fit min-w-fit m-4 p-4 border-2 rounded-xl"} id={"playfield"}>
                <h1 className={"text-4xl font-bold text-center mb-5"} style={{"color":attacking?"yellow":"blue"}}>{attacking?"Your Turn":"Opponent's Turn"}</h1>
                <h1 className={"text-4xl text-center font-bold mb-5 text-gray-800"}>Playfield</h1>
                <Playgrid id={playGridId} cols={cols} rows={rows} size={size} playmode={playMode} extractInfo={extractInfo} attacking={attacking} attack={attack} waitingForReply={waitingForReply}/>
            </div>
            <div className={"min-h-fit min-w-fit m-4 p-4 border-2 rounded-xl"}>
                <h1 className={"text-4xl text-center font-bold mb-5 text-gray-800"}>Your Ship Placement</h1>
                <Placegrid id={placeGridId} cols={cols} rows={rows} size={size} cb={setPlayMode} extractInfo={extractInfo}/>
            </div>
        </div>
        <div className = "hidden min-h-fit min-w-fit m-4 p-4 border-2 rounded-xl bg-gray-300 flex-cols justify-center align-center" id={"post-game"} style={{"width":"50%","justify-self":"center","margin-top":"5rem"}}>
            <p className={"p-2 text-center  text-4xl mb-2"} id={"post-game-message"}></p>
            <button type={"button"} className={"text-center text-4xl text-blue-200 hover:text-blue-500 p-4 border-2 border-black rounded-xl bg-neutral-700"} style={{"width":"100%"}} onClick={()=>{window.location.reload()}}>Play Again?</button>
        </div>
    </>
  )
}

export default App
