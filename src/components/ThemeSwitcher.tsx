import {useEffect, useState} from 'react'
import Moon from './Icons/Moon'
import Sun from './Icons/Sun'
import Button from './Button';
const themes = ["light", "dark"]; 

export default function ThemeSwitcher() {

  const [currentTheme, setCurrentTheme] = useState(themes[0])
  const setTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme)
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    console.log(savedTheme)

    if(savedTheme){
      setTheme(savedTheme)
    }
    else{
      const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(defaultTheme)
    }

  }, []);
  
  return (
    <Button 
    onClick={() => setTheme( (currentTheme == themes[0])? themes[1] : themes[0] )}>
    {(currentTheme == 'light')? <Moon/> : <Sun/>}
  </Button>);
}