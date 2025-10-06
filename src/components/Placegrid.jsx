import React from "react";
import Row from "./Row.jsx";
import Shipoption from "./Shipoption.jsx";




const Placegrid = (props) => {


    const [zoom, setZoom] = React.useState(100);
    const [toPlace, setToPlace] = React.useState(["ship1","ship2","ship3","ship4","ship5","ship6"]);
    const [size, setSize] = React.useState(0);
    const [shipID, setShipID] = React.useState("");
    const [rows, setRows] = React.useState([]);
    const [placing, setPlacing] = React.useState(false);
    let direction = false;
    React.useEffect(
        ()=>{
            direction = false;
            const plc = placing;
            const sID = shipID;
            const s = size;
            const tp = toPlace;
            const index = tp.indexOf(sID);
            const pointer = document.getElementById("pointer")
            if(plc && index>=0 && s>0 && pointer){
                pointer.classList.remove("hidden");
                pointer.style.width = `${7*s}rem`;
                pointer.style.height = `${7}rem`;
                // console.log("beginning placement")
                // console.log(tp.slice(0,index).concat(tp.slice(index+1)));
                setToPlace(tp.slice(0,index).concat(tp.slice(index+1)));
                document.body.style.cursor = "crosshair";
                const temp = document.getElementById(sID);
                temp.classList.remove('bg-gray-200');
                temp.classList.remove('hover:bg-gray-200');
                temp.classList.add('bg-black');
                temp.innerHTML = "";
            }
            else{
                setPlacing(false);
            }
        }, [placing]
    )


    React.useEffect(() => {
        const rowValues = [];
        const numRows = props.rows;
        const numCols = props.cols;
        for (let i = 0; i < numRows; i += 1) {
            rowValues.push(<Row row={i} cols={numCols} size={props.size} id={props.id} key={`row:${i}`}/>)
        }
        //Number of ships to place, used in calculations for spacing
        setRows(rowValues);
        //allows dynamic columns
        setZoom(Math.round(window.devicePixelRatio * 100));
    },[])

    const handleRotate = (e)=>{
        direction=!direction;
        const plcing = placing;
        const s = size;

        if(placing) {
            const ptr = document.getElementById("pointer")
            if(ptr){
               ptr.style.width = direction?"7rem":`${7*s}rem`;
               ptr.style.height = direction?`${7*s}rem`:"7rem";
            }
        }
    };

    const handleMouseMove = (e)=> {
        // console.log(e)
        const plcing = placing;
        if (plcing) {
            const top = document.body.getBoundingClientRect().top;
            const left = document.body.getBoundingClientRect().left;
            // console.log(top, left, e.clientX, e.clientY);
            const ptr = document.getElementById(`pointer`);
            if(ptr) {
                ptr.style.top = `${e.clientY-top}px`;
                ptr.style.left = `${e.clientX-left}px`;
            }

        }
    };

    document.body.addEventListener("keypress", handleRotate);
    document.body.addEventListener('mousemove', handleMouseMove);

    const validateClick = (id, size) =>{
        // console.log(id, size);
        let rtr = false;
        const info = props.extractInfo(id)
        try{
            if(info.row > 0 && info.col > 0){
                if(direction){
                    if(info.row <= props.rows-size) {
                        rtr = true;
                    }
                }
                else{
                    if(info.col <= props.cols-size) {
                        rtr = true;
                    }
                }
            }
        }catch(e){
            console.log(e);
        }

        return rtr;
    }

    const handleClick = (e) => {
        const sze = size;
        const plc = placing;
        if (e.target.id && plc && !e.target.id.includes("ship")) {
            const legalPlace = validateClick(e.target.id, sze);
            // console.log("first check",legalPlace);
            if (legalPlace) {
                const info = props.extractInfo(e.target.id);
                // console.log(info,sze);
                const elements = []
                for(let i = 0; i<sze; i++){
                    const element = document.getElementById(`${props.id}:${direction?info.row+i:info.row}:${direction?info.col:info.col+i}`)
                    if(element){
                        elements.push(element)
                    }
                }
                let secondCheck = true;
                const message = document.getElementById("message");

                elements.forEach(element => {
                    if(!element.classList.contains("bg-gray-200")){
                        if(message){
                            message.classList.add("text-red-500");
                            message.innerText = "Overlap not allowed";
                        }
                        element.classList.add("p-2");
                        element.innerText = "Overlap here"
                        element.classList.add("text-red-500");
                        setInterval(()=>{
                            element.innerText = "";
                            element.classList.remove("text-red-500");
                            element.classList.remove("p-2");
                            if(message){
                                message.innerText = "";
                                message.classList.remove("text-red-500");
                            }
                        },3000)
                        secondCheck = false;
                    }
                })
                // console.log("second check",secondCheck);
                if(secondCheck) {
                    elements.forEach(element => {
                        element.classList.remove('bg-gray-200');
                        element.classList.add('bg-gray-500');
                    })
                    const pointer = document.getElementById("pointer")
                    if (pointer) {
                        pointer.classList.add('hidden');
                        pointer.style.width = "0";
                        pointer.style.height = "0";
                    }
                    setPlacing(false);
                    const tp = toPlace;
                    document.body.style.cursor = "default";
                    if(tp.length <= 0){
                        transitionToPlaying()
                    }
                }
            }
        }
    }

    const transitionToPlaying = () => {
        // console.log("transitioning to playing");
        document.body.removeEventListener("keypress", handleRotate);
        document.body.removeEventListener('mousemove', handleMouseMove);
        const toRemove = document.getElementById(`${props.id}ships`);
        if(toRemove){
            toRemove.remove()
            props.cb(true);
        }
    }

    return (
        <>
            <div className={"flex flex-col mb-10"} id={props.id} key={`${props.id}`} onClick={handleClick}>
                {rows}
            </div>
            <div className={"flex flex-row"} id={props.id+"ships"} key={`${props.id} ships`}>
                <Shipoption shipsize={4} size={props.size} ml = {0} key={'option:1'} id={'ship1'} onClick={()=>{
                    setShipID("ship1");
                    setSize(4)
                    setPlacing(true);}}/>
                <Shipoption shipsize={3} size={props.size} ml = {(props.cols-6)*props.size/(5)} key={'option:2'} id={'ship2'} onClick={()=>{
                    setShipID("ship2");
                    setSize(3)
                    setPlacing(true);
                }}/>
                <Shipoption shipsize={3} size={props.size} ml = {(props.cols-6)*props.size/(5)} key={'option:3'} id={'ship3'} onClick={()=>{
                    setShipID("ship3")
                    setSize(3)
                    setPlacing(true)}}/>
                <Shipoption shipsize={2} size={props.size} ml = {(props.cols-6)*props.size/(5)} key={'option:4'} id={'ship4'} onClick={()=>{
                    setShipID("ship4");
                    setSize(2);
                    setPlacing(true)}}/>
                <Shipoption shipsize={2} size={props.size} ml = {(props.cols-6)*props.size/(5)} key={'option:5'} id={'ship5'} onClick={()=>{
                    setShipID("ship5")
                    setSize(2);
                    setPlacing(true)}}/>
                <Shipoption shipsize={1} size={props.size} ml = {(props.cols-6)*props.size/(5)} key={'option:6'} id={'ship6'} onClick={()=>{
                    setShipID("ship6")
                    setSize(1);
                    setPlacing(true)}}/>
            </div>
            <div id={"pointer"} className={"pointer-events-none hidden border-10 bg-transparent"} style={{"position": "absolute", "height":"0em", "width": "0em"}}></div>
        </>
    )
}

export default Placegrid
