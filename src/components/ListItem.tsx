import React from "react";
import Button from "./Button";
import Clipboard from "./Icons/Clipboard";
import Star from "./Icons/Star";
import Message from "./Message";
type ListItemProps = {
    style?: React.CSSProperties | undefined,
    index: bigint,
    UUID: string,
    onFav: () => void ,
    onUnfav: () => void,
    isFav: boolean,
    onCopy: () => void
}

function ListItem({style, index, UUID, onFav, onUnfav, isFav, onCopy}: ListItemProps){
    return (
    <li style={style}
        onClick={onCopy}
        className="flex bg-surface items-center text-surface-content border-y-1 border-base-200 hover:bg-base-200">
            <div className="flex px-2 border-r-2 border-base-200">
            <div className="text-surface-content/50 whitespace-nowrap">{''.padStart(37-index.toString().length, '0')}</div> 
            <div className="whitespace-nowrap" >{index}</div>
        </div> 
        <div className="px-2 whitespace-nowrap">{UUID}</div>
        <Button onClick={(e) => {e.stopPropagation(); isFav ? onUnfav() : onFav();}} isTransparrent={true}><Star/></Button>
        <Button onClick={onCopy} isTransparrent={true}><Clipboard/></Button>
    </li>
    )
}

export default ListItem