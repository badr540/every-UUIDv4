import { useRef } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import type { ComponentProps } from "react";

type MyScrollBarType = {
  setScrollPrecentage: (vals :number) => void | undefined, 
  style?: React.CSSProperties | undefined,
  children?: React.ReactNode | undefined
}

type ScrollState = { scrollTop: number, scrollHeight: number, clientHeight: number }

function MyScrollBar({setScrollPrecentage, style, children}: MyScrollBarType){


  function handleScroll({ scrollTop, scrollHeight, clientHeight }: ScrollState){
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setScrollPrecentage(1)
    }
    else{
      setScrollPrecentage(scrollTop/(scrollHeight - clientHeight))
    }
  };

  return (
  <Scrollbar
    style={style}
    onUpdate={handleScroll}
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