import {useState, useEffect, useContext, useRef} from "react";
import ListItem from "./ListItem";
import MyScrollBar from "./MyScrollBar";
import Big from 'big.js';
import {getUUID, searchUUIDIndex} from "../utils/UUIDIndexing";
import {permute, invert} from '../utils/shuffle'
import FavoritesContext from'../contexts/FavoritesContext';
import ShuffleContext from "../contexts/ShuffleContext";
import SearchContext from "../contexts/SearchContext";
import Message from "./Message";

type ScrollState = { scrollTop: number, scrollHeight: number, clientHeight: number }

function UUIDList(){
    const minItemHeight = 30;
    const itemsPerPage = 20;

    const [scrollState, setScrollState] = useState<ScrollState>({scrollTop: 0, scrollHeight:1, clientHeight: 0})
    const [UUIDIndex, setUUIDIndex] = useState(0n);
    const [favoritesList, setFavoritesList] = useState(new Set<string>())
    
    const [showMessage, setShowMessage] = useState(false)
    const [messageText, setMessageText] = useState("")


    const [itemHeight, setItemHeight] = useState(0)

    const [showFavorites] = useContext(FavoritesContext)
    const [isShuffled] = useContext(ShuffleContext)

    const [searchTerm,,searchIndex,,,] =  useContext(SearchContext)

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
        const favorites = new Set<string>(stored);
        setFavoritesList(favorites)

        if (!ref.current) return;

        const update = (height: number) => {
            setItemHeight(Math.max(height / itemsPerPage, minItemHeight));
        };

        update(ref.current.offsetHeight);

        const observer = new ResizeObserver(([entry]) => {
            update(entry.contentRect.height);
        });

        return () => observer.disconnect();
    },[]);

    useEffect(() => {
        const maxIndex: bigint = (1n << 122n) - BigInt(itemsPerPage)
        let index: bigint = searchUUIDIndex(searchTerm, searchIndex)
        index = (isShuffled)? invert(index) : index
        if(index == -1n) return;

        handleSetUUIDIndex(index)
        const scrollTop = (scrollState.scrollHeight - scrollState.clientHeight) * Big(index.toString()).div(maxIndex.toString()).toNumber()
        setScrollState(state => ({...state, scrollTop}))
    }, [searchTerm, searchIndex])

    function handleSetScrollState({scrollTop, scrollHeight, clientHeight}:ScrollState){
        setScrollState({scrollTop, scrollHeight, clientHeight})
        let scrollPercentage = 0
        if (scrollTop + clientHeight >= scrollHeight - 1) {
            scrollPercentage = 1
        }
        else{
            scrollPercentage = (scrollTop/(scrollHeight - clientHeight))
        }

        handleSetUUIDIndex(BigInt(
            new Big(((1n << 122n) - 1n).toString())
            .times(scrollPercentage)
            .round()
            .toFixed(0)
        ))
    }

    function handleSetUUIDIndex(UUIDIndex: bigint){
        const maxIndex: bigint = (1n << 122n) - BigInt(itemsPerPage)
        UUIDIndex = (UUIDIndex < 0)? 0n : UUIDIndex
        UUIDIndex = (UUIDIndex > maxIndex) ? maxIndex : UUIDIndex
        setUUIDIndex(UUIDIndex)
    }

    function handleScrollWheelEvent(e: React.WheelEvent<HTMLUListElement>){
        let newIndex: bigint = BigInt(Math.round(e.deltaY/100)) + UUIDIndex;
        handleSetUUIDIndex(newIndex)
    }

    function addToFavorites(number: bigint){
        const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
        const favorites = new Set<string>(stored);
        if(!favorites.has(number.toString())){
            favorites.add(number.toString())
            localStorage.setItem("favorites", JSON.stringify([...favorites]))
        }
        setFavoritesList(favorites)
        setMessageText("Added To Favorites!")
        setShowMessage(true)
    }

    function removeFromFavorites(number: bigint){
        const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
        const favorites = new Set<string>(stored);
        if(favorites.has(number.toString())){
            favorites.delete(number.toString())
            localStorage.setItem("favorites", JSON.stringify([...favorites]))
        }
        setFavoritesList(favorites)
    }

    function handleCopy(UUID: string){
        navigator.clipboard.writeText(UUID)
        setMessageText("Copied!")
        setShowMessage(true)
    }
    
    const displayList: bigint[] = (showFavorites)? [...favoritesList].map(numberStr => BigInt(numberStr)) : Array(20).fill(0n).map((_, index) => UUIDIndex + BigInt(index))

    const listElements: React.ReactNode[] = displayList
    .map<[bigint, bigint]>(number => (isShuffled && !showFavorites)? [number, permute(number)]: [number, number])
    .map(([index, UUID], listIndex) => (
        <ListItem 
            key={listIndex} 
            style={{height:itemHeight}} 
            index={index} 
            UUID={getUUID(UUID)} 
            onFav={() => addToFavorites(UUID)}
            onUnfav={() => removeFromFavorites(UUID)}
            isFav={favoritesList.has(UUID.toString())}
            onCopy={() => handleCopy(getUUID(UUID))}
        />)); 

    return (
    <div ref={ref} className="flex w-[100%] h-[100%] overflow-hidden">
        {showMessage && <Message text={messageText} onClose={() => setShowMessage(false)} duration={500}/>}
        
        {!showFavorites && <>
        <ul
            onWheel={handleScrollWheelEvent}
            className="flex-col border-surface text-base-content pr-[10px] overflow-clip w-[100%] h-[100%]"
            >{listElements}
        </ul>
        <MyScrollBar setScrollState={handleSetScrollState} style={{height:"100%", width: "15px", margin: "0px", padding: "0px"}} scrollTop={scrollState.scrollTop}>
            <div className="w-[0px] h-10000"></div>
        </MyScrollBar>
        
        </>}
        {showFavorites && <>
            <MyScrollBar setScrollState={()=>{}} style={{height:"100%", margin: "0px", padding: "0px"}} scrollTop={scrollState.scrollTop}>
            <ul                
                className="flex-col border-surface text-base-content pr-[15px] overflow-clip w-[100%] h-max"
                >{listElements}
            </ul>
            </MyScrollBar>
        </>}
    </div>  )
}

export default UUIDList;