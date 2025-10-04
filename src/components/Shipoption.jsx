import {useState} from "react";


const Shipoption = (props) => {

    const shipSize = props.shipsize;
    let shipSprite = '';
    for(let i = 0; i < shipSize; i++) {
        shipSprite += '0';
    }

    return (
        <>
            <div className={"flex flex-row border-1 border-black flex-cols items-center justify-center hover:bg-gray-200"} style={{"width":`${props.size}em`,"height":`${props.size}em`, "marginLeft":`${props.ml}em`}} id={props.id} onClick={props.onClick}>
                <p className={"justify-center text-4xl font-bold"}>{shipSprite}</p>
            </div>
        </>
    )
}

export default Shipoption;