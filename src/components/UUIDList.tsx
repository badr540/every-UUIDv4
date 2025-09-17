import {useState, useEffect, useContext} from "react";
import ListItem from "./ListItem";
import MyScrollBar from "./MyScrollBar";
import Button from "./Button";
import Big from 'big.js';
import formatUUID from "../utils/formatUUID";
import {permute, invert} from '../utils/shuffle'

import FavoritesContext from'../contexts/FavoritesContext';
import ShuffleContext from "../contexts/ShuffleContext";

function UUIDList(){
    const [scrollPercentage, setScrollPercentage] = useState(1.0);
    const [UUIDIndex, setUUIDIndex] = useState(0n);
    const [displayList, setDisplayList] = useState(Array(16).fill({}).map((_, index) => BigInt(index)))
    const [favoritesList, setFavoritesList] = useState<React.ReactNode[]>([])

    const [showFavorites, setShowFavorites] = useContext(FavoritesContext)
    const [isShuffled, setShuffle] = useContext(ShuffleContext)

    function handleScrollWheelEvent(e: React.WheelEvent<HTMLUListElement>){
        let newIndex: bigint = BigInt(Math.round(e.deltaY/100)) + UUIDIndex;
        newIndex = (newIndex < 0)? 0n : newIndex
        newIndex = newIndex % (1n << 122n)
        setUUIDIndex(newIndex)
    }

    function addToFavorites(number: bigint){
        const stringifiedJSON: string = localStorage.getItem("favorites") || '{"favorites": []}'
        
        const favorites: string[] = JSON.parse(stringifiedJSON)['favorites']
        favorites.push(number.toString())
        favorites.sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0));
        localStorage.setItem("favorites", JSON.stringify({favorites}))
    }

    function removeFromFavorites(number: bigint){
        const stringifiedJSON: string = localStorage.getItem("favorites") || '{"favorites": []}'
        
        const favorites: string[] = JSON.parse(stringifiedJSON)['favorites']
        favorites.push(number.toString())
        favorites.sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0));
        localStorage.setItem("favorites", JSON.stringify({favorites}))
    }

    useEffect(() =>{
        setUUIDIndex(BigInt(
            new Big(((1n << 122n) - 1n).toString())
                .times(scrollPercentage)
                .round()
                .toFixed(0)
        ))
    }, [scrollPercentage])

    useEffect(() =>{
        setDisplayList(list => list.map((_,index) => (UUIDIndex + BigInt(index) )))
    }, [UUIDIndex])

    useEffect(() => {
        if(!showFavorites) return;
        const stringifiedJSON: string = localStorage.getItem("favorites") || '{"favorites": []}'
        const favorites: string[] = JSON.parse(stringifiedJSON)['favorites']
        setFavoritesList(
            favorites.map(number => BigInt(number))
            .map((number, index) =>
                <ListItem key={index}>
                    <div className="flex px-2 border-r-2 border-base-200">
                        <div className="text-surface-content/50">{''.padStart(37-number.toString().length, '0')}</div> 
                        <div >{number.toString()}</div>
                    </div> 
                    <div className="px-2">{formatUUID(number)}</div>
                    <Button onClick={() => removeFromFavorites(number)}>unfav</Button>
                    <Button onClick={() => navigator.clipboard.writeText(formatUUID(number))}>copy</Button>
                </ListItem>
            )
        )

    }, [showFavorites])
    
    const listElements: React.ReactNode[] = displayList
    .map(number => isShuffled ? permute(number) : number)
    .map((number, index) => 
    <ListItem key={index}>
        <div className="flex px-2 border-r-2 border-base-200">
            <div className="text-surface-content/50">{''.padStart(37-number.toString().length, '0')}</div> 
            <div >{number.toString()}</div>
        </div> 
        <div className="px-2">{formatUUID(number)}</div>
        <Button onClick={() => addToFavorites(number)}>fav</Button>
        <Button onClick={() => navigator.clipboard.writeText(formatUUID(number))}>copy</Button>
    </ListItem>);

    return (
    <div className="flex w-[100%] h-[100%] overflow-hidden px-5 pb-2">
        {!showFavorites && <>
        <ul
            onWheel={handleScrollWheelEvent}
            className="flex flex-col border-surface text-base-content pr-[10px] overflow-clip w-[100%] h-[100%]"
            >{listElements}
        </ul>
        <MyScrollBar onScrollChange={(val) => setScrollPercentage(val)} style={{height:"100%", width: "15px", margin: "0px", padding: "0px"}}>
            <div className="w-[0px] h-10000"></div>
        </MyScrollBar>
        
        </>}
        {showFavorites && <>
            <MyScrollBar onScrollChange={()=>{}} style={{height:"100%", margin: "0px", padding: "0px"}}>
            <ul                
                className="flex flex-col border-surface text-base-content pr-[15px] overflow-clip w-[100%] h-[100%]"
                >{favoritesList}
            </ul>
            </MyScrollBar>
        </>}
    </div>  )
}

export default UUIDList;