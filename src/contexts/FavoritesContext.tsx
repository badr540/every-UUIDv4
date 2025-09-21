import { createContext, useState} from "react";

type FavoritesContextType = [
    showFavorites: boolean,
    setShowFavorites: (val:boolean) => void
]

const FavoritesContext = createContext<FavoritesContextType>([false, () =>{}]);

export const FavoritesProvider = ({ children }: {children: React.ReactNode}) => {
    const [showFavorites, setShowFavorites] = useState(false);

    return (
        <FavoritesContext.Provider value={[showFavorites, setShowFavorites]}>
        {children}
      </FavoritesContext.Provider>
    )
}

export default FavoritesContext;