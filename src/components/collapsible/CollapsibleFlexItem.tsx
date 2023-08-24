import { useState } from "react";
import Collapsible, { CollapsibleProps } from "./Collapsible";

export default function CollapsibleFlexItem(props: CollapsibleProps) {
  const [className, setClassName] = useState(
    getClassName(props.initialCollapsed ?? false, props.className)
  );

  return (
    <Collapsible
      {...props}
      className={className}
      onCollapse={(isCollapsed) => {
        setClassName(getClassName(isCollapsed, props.className));
        props.onCollapse?.(isCollapsed);
      }}
    >
      {props.children}
    </Collapsible>
  );
}

function getClassName(isCollapsed: boolean, className: string | undefined) {
  if (isCollapsed) {
    return `${className} flex flex-col flex-none`;
  } else {
    return `${className} flex flex-col flex-1`;
  }
}
