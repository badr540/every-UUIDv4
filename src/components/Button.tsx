function Button({onClick, children}: {onClick: () => void, children: React.ReactNode}){
    return (
    <button 
        className='bg-surface text-surface-content p-2 rounded-xs hover:cursor-pointer'
        onClick={onClick}
    >
        {children}
    </button>
    )
}

export default Button;