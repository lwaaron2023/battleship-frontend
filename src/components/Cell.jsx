const Cell = (props) => {
    let content;
    const row = props.row;
    const col = props.col;
    const id = `${props.id}:${row}:${col}`;



    if(props.content !== ""){
        content = (
            <p className={'text-center font-bold text-4xl'}>{props.content}</p>
        )
    }
    let rtr;
    if(row === 0 && col === 0){
        rtr = (<div className={`aspect-square border-1 border-black bg-white flex flex-cols items-center justify-center`} style={{"width":`${props.size}em`,"height":`${props.size}em`}} id={id}>
            <p className={'text-center text-8xl font-thin justify-self-center'}>X</p>
        </div>)
    }
    else{
        rtr = (<div className={`aspect-square border-1 bg-gray-200 border-black flex flex-cols items-center justify-center`} style={{"width":`${props.size}em`,"height":`${props.size}em`}} id={id}>
            {content}
        </div>)
    }
    return (
        <>
            {rtr}
        </>
    )
}

export default Cell
