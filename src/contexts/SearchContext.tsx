import {createContext, useState} from "react";

type SearchContextType = [
    searchTerm: string,
    setSearchTerm: (searchTerm: string) => void,
    searchIndex: bigint,
    setSearchIndex: (index: bigint) => void,
    showSearchBox: boolean,
    setShowSearchBox: (showSearchBox: boolean) => void, 
]

const SearchContext = createContext<SearchContextType>(["", () =>{}, 0n, ()=>{}, false, () => {}]);

export const SearchProvider = ({ children }: {children: React.ReactNode}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchIndex,setSearchIndex] = useState(0n)
    const [showSearchBox, setShowSearchBox] = useState(false)

    return (
        <SearchContext.Provider value={[searchTerm, setSearchTerm, searchIndex, setSearchIndex ,showSearchBox, setShowSearchBox]}>
        {children}
      </SearchContext.Provider>
    )
}

export default SearchContext;