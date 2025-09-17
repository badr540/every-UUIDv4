import { Scrollbar } from 'react-scrollbars-custom';

type MyScrollBarType = {
  onScrollChange: (vals :number) => void | undefined, 
  style?: React.CSSProperties | undefined,
  children?: React.ReactNode | undefined
}

function MyScrollBar({onScrollChange, style, children}: MyScrollBarType){

  return (
  <Scrollbar
    style={style}
    onUpdate={(value) => onScrollChange(value.scrollTop/value.scrollHeight)}
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