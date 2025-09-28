import {useContext} from "react";
import type {CSSProperties} from "react";
import Button from "./Button";
import Clipboard from "./Icons/Clipboard";
import Star from "./Icons/Star";
import SearchContext from "../contexts/SearchContext";

type ListItemProps = {
    style?: CSSProperties | undefined,
    index: bigint,
    UUID: string,
    onFav: () => void ,
    onUnfav: () => void,
    isFav: boolean,
    onCopy: () => void
}

function findMatch(term:string, searchTerm: string, ignore:string): [number, number]{
    if(searchTerm == '') return [-1,-1] 
    let currMatch = 0
    let ignored = 0
    for(let i = 0; i < term.length; i++){
        if(term[i] == searchTerm[currMatch]){
            currMatch++
        }
        else if(term[i] == ignore){
            ignored++
        }
        else{
            currMatch = 0
            ignored = 0
        }

        if(currMatch == searchTerm.length){
            const matchLength = currMatch+ignored
            return [i-matchLength+1, i]
        }
    }

    return [-1,-1]
}

function ListItem({style, index, UUID, onFav, onUnfav, isFav, onCopy}: ListItemProps){
    const [searchTerm] = useContext(SearchContext)
    let UUIDNode = (<div className="px-2 whitespace-nowrap">{UUID}</div>)
    let [matchS, matchE] = findMatch(UUID, searchTerm, '-')
    
    if(matchS != -1){
        UUIDNode =(
        <div className="px-2 whitespace-nowrap">
        {UUID.slice(0, matchS)}
        <mark>{UUID.slice(matchS, matchE+1)}</mark>
        {UUID.slice(matchE+1)}
        </div>
        )
    }

    return (
    <li style={style}
        onClick={onCopy}
        className="flex bg-surface items-center text-surface-content border-y-1 border-base-200 hover:bg-base-200">
            <div className="flex px-2 border-r-2 border-base-200">
            <div className="text-surface-content/50 whitespace-nowrap">{''.padStart(37-index.toString().length, '0')}</div> 
            <div className="whitespace-nowrap" >{index}</div>
        </div> 
        {UUIDNode}
        <Button onClick={(e) => {e.stopPropagation(); isFav ? onUnfav() : onFav();}} isTransparrent={true}><Star/></Button>
        <Button onClick={onCopy} isTransparrent={true}><Clipboard/></Button>
    </li>
    )
}

export default ListItem