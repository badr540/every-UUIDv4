import { useEffect, useContext, useRef } from "react";
import SearchContext from "../contexts/SearchContext";
import FavoritesContext from "../contexts/FavoritesContext";
import Button from "./Button";
import ArrowDown from "./Icons/ArrowDown";
import ArrowUp from "./Icons/ArrowUp";
import Close from "./Icons/Close";
import { findNumOfMatches } from "../utils/UUIDIndexing";
import { formatBigNumber, isBigNumber, modCycle } from "../utils/mathUtils";


function SearchBox() {

    const [searchTerm, setSearchTerm, searchIndex, setSearchIndex ,showSearchBox, setShowSearchBox] =  useContext(SearchContext)
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "f") {
            e.preventDefault();
            setShowSearchBox(true);
        } else if (e.key === "Escape") {
            setShowSearchBox(false);
        }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if(showSearchBox){
            inputRef.current?.focus();
        }
        else{
            setSearchTerm('')
            setSearchIndex(0n)
        }
    }, [showSearchBox]);

    useEffect(() => {
        setSearchIndex(0n);
    }, [searchTerm])

    const matches = findNumOfMatches(searchTerm)
    let displayIndex: string = '';
    if(matches > 0n){
        if(searchIndex < 0n){
            displayIndex = (isBigNumber(matches))? `(${formatBigNumber(matches)}) - ${searchIndex.toString().replace('-', '')}` 
            : (modCycle(searchIndex,matches) + 1n).toString() 
        }
        else{
            displayIndex = (modCycle(searchIndex, matches) + 1n).toString() 
        }
    }
    
    console.log(displayIndex)
    
    if (!showSearchBox) return null;

    return (
      <div 
        className="
            fixed top-0 right-0 
            bg-surface text-surface-content rounded-md 
            popup-fade max-w-full max-h-full p-3 border-base-content shadow-2xl
            flex-col
            z-50
            "
        
        >
        <input 
            ref={inputRef}
            type="text" 
            className="border-1 border-surface-content bg-base-100 p-1 w-80 text-sm" 
            placeholder="find" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}>

        </input>
        <div className="flex justify-between p-1">
            {(matches == 0n) &&<span className="flex items-center text-red-500">No results</span>}
            {(matches > 0) && <span className="flex items-center">{displayIndex} of {formatBigNumber(matches)}</span>}
            <div className="flex justify-between">
                {matches > 0 && <>
                    <Button onClick={() => setSearchIndex(searchIndex-1n)}><ArrowUp/></Button>
                    <Button onClick={() => setSearchIndex(searchIndex+1n)}><ArrowDown/></Button>
                </>}
                <Button onClick={() => setShowSearchBox(false)}><Close/></Button>
            </div>
        </div>
      </div>

    );
}

export default SearchBox;