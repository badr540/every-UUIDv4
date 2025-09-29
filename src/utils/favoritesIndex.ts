import { getUUID } from "./UUIDIndex";
import { modCycle } from "./mathUtils";
import findMatchingSubstrings from "./findMatchingSubstrings";

export function searchUUIDIndexInFavorites(searchTerm: string, searchIndex: bigint): bigint{
    let matches = findNumOfMatchesInFavorites(searchTerm)
    searchIndex = modCycle(searchIndex, matches)
    let matchIndex = -1
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    for(let favIndex of favorites){
        if(findMatchingSubstrings(getUUID(favIndex), searchTerm, new Set(['-'])).length){
            matchIndex++
        }

        if(matchIndex == Number(searchIndex)){
            return favIndex
        }
    }

    return -1n
}

export function findNumOfMatchesInFavorites(searchTerm: string): bigint{
    let matches = 0n
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    for(let favIndex of favorites){
        if(findMatchingSubstrings(getUUID(BigInt(favIndex)), searchTerm, new Set(['-'])).length){
            matches++
        }
    }
    return matches
}
