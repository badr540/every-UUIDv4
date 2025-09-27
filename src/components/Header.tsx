import {useContext, useEffect} from 'react'
import ThemeSwitcher from "./ThemeSwitcher"
import Button from "./Button"
import FavoritesContext from'../contexts/FavoritesContext';
import ShuffleContext from '../contexts/ShuffleContext';
import Star from  './Icons/Star'
import SearchContext from '../contexts/SearchContext';
import SearchBox from './SearchBox';
function Header(){
    const [showFavorites, setShowFavorites] = useContext(FavoritesContext)
    const [isShuffled, setShuffle] = useContext(ShuffleContext)
    const [,,,,showSearchBox,setShowSearchBox] =  useContext(SearchContext)

    useEffect(() => {
        if(showFavorites){
            setShuffle(false)
        }
    }, [showFavorites, isShuffled])

    return(
        <header
            className="flex w-screen h-[10%] justify-between p-5 items-center"
        >
            <SearchBox/>
            <h1 className="text-base-content text-2xl md:text-4xl font-extrabo">

                Every UUIDv4
            </h1>
            <div className="flex justify-around w-[25%]">
            <Button onClick={()=> setShowSearchBox(!showSearchBox)}>Search</Button>
            <Button onClick={()=> setShuffle(!isShuffled)} isActive={isShuffled}>{"Shuffle"}</Button>
            <Button onClick={() => setShowFavorites(!showFavorites)} isActive={showFavorites}><Star/></Button>
            <ThemeSwitcher/>
            </div>
        </header>
    )
}

export default Header