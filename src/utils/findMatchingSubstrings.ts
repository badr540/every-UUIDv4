export type Range = {start: number; end: number };
export default function findMatchingSubstrings(term:string, searchTerm: string, ignoreList:Set<string>): Range[]{
    if(searchTerm === '' || term === '') return [] 
    let currMatch = 0
    let ignored = 0
    let matches = []
    for(let i = 0; i < term.length; i++){
        if(term[i] == searchTerm[currMatch]){
            currMatch++
        }
        else if(ignoreList.has(term[i]) && currMatch > 1){
            ignored++
        }
        else{
            currMatch = 0
            ignored = 0
        }

        if(currMatch == searchTerm.length){
            const matchLength = currMatch+ignored
            let currRange: Range = {start:i-matchLength+1, end: i+1}
            matches.push(currRange)
            currMatch = 0
            ignored = 0
        }
    }

    return matches
}