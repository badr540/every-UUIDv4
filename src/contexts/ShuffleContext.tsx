import { createContext, useState} from "react";

type ShuffleContextType = [
    isShuffled: boolean,
    setShuffle: (val:boolean) => void
]

const ShuffleContext = createContext<ShuffleContextType>([false, (val) =>{}]);

export const ShuffleProvider = ({ children }: {children: React.ReactNode}) => {
    const [isShuffled, setShuffle] = useState(false);

    return (
        <ShuffleContext.Provider value={[isShuffled, setShuffle]}>
        {children}
      </ShuffleContext.Provider>
    )
}

export default ShuffleContext;