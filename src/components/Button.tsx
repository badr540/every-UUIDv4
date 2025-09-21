
type ButtonProps = {
    onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
    children: React.ReactNode;
    isActive?: boolean;
    isTransparrent?: boolean
}   

function Button({onClick, children, isActive = false, isTransparrent=false}: ButtonProps){
    return (
    <button 
        className={`${isActive? "text-surface bg-surface-content":"text-surface-content bg-surface"} ${isTransparrent? "bg-transparent" : ""} p-2 rounded-md hover:cursor-pointer hover:brightness-80`}
        onClick={onClick}
    >
        {children}
    </button>
    )
}

export default Button;