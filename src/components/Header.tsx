import {useContext} from 'react'
import ThemeSwitcher from "./ThemeSwitcher"
import Button from "./Button"
import FavoritesContext from'../contexts/FavoritesContext';
import ShuffleContext from '../contexts/ShuffleContext';
function Header(){
    const [showFavorites, setShowFavorites] = useContext(FavoritesContext)
    const [isShuffled, setShuffle] = useContext(ShuffleContext)

    return(
        <header
            className="flex w-screen h-[10%] justify-between p-5 items-center"
        >
            <h1 className="text-base-content text-2xl md:text-4xl font-extrabo">

                Every UUIDv4
            </h1>
            <div className="flex justify-around w-[25%]">
            <Button onClick={() => setShowFavorites(!showFavorites)}>Favorites</Button>
            <Button onClick={()=> setShuffle(!isShuffled)}>{(isShuffled)? "Unshuffle": "Shuffle"}</Button>
            <ThemeSwitcher/>
            </div>
        </header>
    )
}

export default Header