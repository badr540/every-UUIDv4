import { getUUID } from "./UUIDIndex";
import { modCycle } from "./mathUtils";
import findMatchingSubstrings from "./findMatchingSubstrings";

export function searchUUIDIndexInFavorites(searchTerm: string, searchIndex: bigint): bigint{
    let matches = findNumOfMatchesInFavorites(searchTerm)
    searchIndex = modCycle(searchIndex, matches)
    let matchIndex = -1
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]") as string[]
    const favorites = stored.map(s => BigInt(s))

    for(let favIndex of favorites){
        if(findMatchingSubstrings(getUUID(favIndex), searchTerm, new Set(['-'])).length > 0){
            matchIndex++
        }

        if(matchIndex == Number(searchIndex)){
            console.log(favIndex)
            return favIndex
        }
    }

    return -1n
}

export function findNumOfMatchesInFavorites(searchTerm: string): bigint{
    let matches = 0n
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]") as string[];
    const favorites = stored.map(s => BigInt(s))
    for(let favIndex of favorites){
        if(findMatchingSubstrings(getUUID(favIndex), searchTerm, new Set(['-'])).length > 0){
            matches++
        }
    }
    return matches
}
