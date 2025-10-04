import Cell from "./Cell.jsx";


const Row = (props) => {

    const cells = [];


    for (let j = 0; j < props.cols; j += 1) {
        let contents = ""
        if(props.row === 0){
            if(j > 0){
                contents = String.fromCharCode(64+j);
            }
        }
        else{
            if(j===0){
                contents = `${props.row}`
            }
        }


        cells.push(<Cell row={props.row} col={j} size={props.size} id={props.id} key={`cell:${props.row}:${j}`} content={contents} placing={props.placing} />)
    }

    //allows dynamic columns
    return (
        <>
            <div className={"flex flex-row"} key={`${props.id}:row:${props.row}`}>
                {cells}
            </div>
        </>
    )
}

export default Row;