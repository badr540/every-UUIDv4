import React from "react";

type ListItemProps = {
    children: React.ReactNode
}

function ListItem({children}: ListItemProps){
    return (
    <li className="flex bg-surface items-center text-surface-content border-y-1 border-base-200 h-[100%]">
        {children}
    </li>
    )

}

export default ListItem