import { useEffect, useState } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

type ScrollState = { scrollTop: number, scrollHeight: number, clientHeight: number }

type MyScrollBarType = {
  setScrollState: (vals :ScrollState) => void | undefined, 
  scrollTop: number,
  style?: React.CSSProperties | undefined,
  children?: React.ReactNode | undefined
}



function MyScrollBar({setScrollState, scrollTop, style, children}: MyScrollBarType){
  const [isThumbScroll, setThumbScroll] = useState(true) //is the scroll triggered by a thumb move

  useEffect(()=>{
    setThumbScroll(false)
  }, [scrollTop])
  
  function handleUpdate(state: ScrollState){
    if(isThumbScroll){
      setScrollState(state)
    }
    else{
      setThumbScroll(true)
    }
  }
  
  return (
  <Scrollbar
    style={style}
    scrollTop={scrollTop}
    onUpdate={handleUpdate}
    trackYProps={{
      renderer: ({ elementRef, style, ...props }) => (
        <div
          {...props}
          ref={elementRef}
          style={{
            ...style,
            backgroundColor: "var(--color-base-200)",
            borderRadius: "0.1rem",
            padding: "0px",
            height: "100%",
            width: "15px",
            top: "0px"
          }}
        />
      ),
    }}
    thumbYProps={{
      renderer: ({ elementRef, style, ...props }) => (
        <div
          {...props}
          ref={elementRef}
          style={{
            ...style,
            backgroundColor: "var(--color-surface)",
            borderRadius: "0.1rem",
            padding: "0px"
          }}
        />
      ),
    }}
  >
    {children}
  </Scrollbar>
  );

}

export default MyScrollBar;