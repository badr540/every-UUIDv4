import {useState, useEffect, useContext, useRef} from "react";
import ListItem from "./ListItem";
import MyScrollBar from "./MyScrollBar";
import Big from 'big.js';
import formatUUID from "../utils/formatUUID";
import {permute} from '../utils/shuffle'
import FavoritesContext from'../contexts/FavoritesContext';
import ShuffleContext from "../contexts/ShuffleContext";
import Message from "./Message";

function UUIDList(){
    const minItemHeight = 30;
    const itemsPerPage = 20;

    const [scrollPercentage, setScrollPercentage] = useState(1.0);
    const [UUIDIndex, setUUIDIndex] = useState(0n);
    const [favoritesList, setFavoritesList] = useState(new Set<string>())
    
    const [showMessage, setShowMessage] = useState(false)
    const [messageText, setMessageText] = useState("")

    const [itemHeight, setItemHeight] = useState(0)

    const [showFavorites] = useContext(FavoritesContext)
    const [isShuffled] = useContext(ShuffleContext)
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

    function handleScrollWheelEvent(e: React.WheelEvent<HTMLUListElement>){
        let newIndex: bigint = BigInt(Math.round(e.deltaY/100)) + UUIDIndex;
        newIndex = (newIndex < 0)? 0n : newIndex
        newIndex = newIndex % (1n << 122n)
        if(newIndex> (1n << 122n) - BigInt(itemsPerPage))
            newIndex = (1n << 122n) - BigInt(itemsPerPage)
        setUUIDIndex(newIndex)
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

    useEffect(() =>{
        if(scrollPercentage >= 1){
            setUUIDIndex((1n << 122n) - BigInt(itemsPerPage))
        }
        else{   
            setUUIDIndex(BigInt(
                new Big(((1n << 122n) - 1n).toString())
                .times(scrollPercentage)
                .round()
                .toFixed(0)
            ))
        }
    }, [scrollPercentage])

    const displayList: bigint[] = (showFavorites)? [...favoritesList].map(numberStr => BigInt(numberStr)) : Array(20).fill(0n).map((_, index) => UUIDIndex + BigInt(index))

    const listElements: React.ReactNode[] = displayList
    .map<[bigint, bigint]>(number => (isShuffled && !showFavorites)? [number, permute(number)]: [number, number])
    .map(([index, UUID], listIndex) => (
        <ListItem 
            key={listIndex} 
            style={{height:itemHeight}} 
            index={index} 
            UUID={formatUUID(UUID)} 
            onFav={() => addToFavorites(UUID)}
            onUnfav={() => removeFromFavorites(UUID)}
            isFav={favoritesList.has(UUID.toString())}
            onCopy={() => handleCopy(formatUUID(UUID))}
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
        <MyScrollBar setScrollPrecentage={setScrollPercentage} style={{height:"100%", width: "15px", margin: "0px", padding: "0px"}}>
            <div className="w-[0px] h-10000"></div>
        </MyScrollBar>
        
        </>}
        {showFavorites && <>
            <MyScrollBar setScrollPrecentage={()=>{}} style={{height:"100%", margin: "0px", padding: "0px"}}>
            <ul                
                className="flex-col border-surface text-base-content pr-[15px] overflow-clip w-[100%] h-max"
                >{listElements}
            </ul>
            </MyScrollBar>
        </>}
    </div>  )
}

export default UUIDList;