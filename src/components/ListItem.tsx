import {useContext} from "react";
import type {CSSProperties} from "react";
import Button from "./Button";
import Clipboard from "./Icons/Clipboard";
import Star from "./Icons/Star";
import SearchContext from "../contexts/SearchContext";
import findMatchingSubstrings from "../utils/findMatchingSubstrings";
import type {Range} from "../utils/findMatchingSubstrings";

type ListItemProps = {
    style?: CSSProperties | undefined,
    index: bigint,
    UUID: string,
    onFav: () => void ,
    onUnfav: () => void,
    isFav: boolean,
    onCopy: () => void,
    isInFocus: boolean,
}

function markMatches(s:string, matches: Range[], isInFocus:boolean): React.ReactNode[] {
    if(matches.length  == 0) return [<>{s}</>]
    let marked: React.ReactNode[] = []
    let prev: Range = {start:0, end:0}
    
    for(let range of matches){
        if(prev.end != range.start){
            marked.push(<span>{s.slice(prev.end, range.start)}</span>)
        }
        marked.push(<mark className={isInFocus? "bg-orange-400": ""}>{s.slice(range.start, range.end)}</mark>)
        prev = range
    }

    if(prev.end != s.length){
        marked.push(<span>{s.slice(prev.end)}</span>)
    }

    return marked
    
}

function ListItem({style, index, UUID, onFav, onUnfav, isFav, onCopy, isInFocus}: ListItemProps){
    const [searchTerm] = useContext(SearchContext)
    
    let matches: Range[] = findMatchingSubstrings(UUID, searchTerm, new Set(['-']))

    let UUIDNode = (<div className="px-2 whitespace-nowrap">{markMatches(UUID, matches, isInFocus)}</div>)

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