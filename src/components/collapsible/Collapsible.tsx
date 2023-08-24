import {
  ReactNode,
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Icon } from "@iconify/react";

export type CollapsibleRef = Ref<
  {
    collapse: () => void;
    expand: () => void;
    isCollapsed: () => boolean;
  } & HTMLDivElement
>;

export type CollapsibleProps = {
  label?: string;
  initialCollapsed?: boolean;
  children: ReactNode;
  className?: string;
  onCollapse?: (isCollapsed: boolean) => void;
};

const Collapsible = forwardRef(function Collapsible(
  props: CollapsibleProps,
  ref: CollapsibleRef
) {
  const { label, initialCollapsed, children, className } = props;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed ?? false);
  const divRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      collapse: () => setIsCollapsed(true),
      expand: () => setIsCollapsed(false),
      isCollapsed: () => isCollapsed,
      ...divRef.current!,
    }),
    [isCollapsed, setIsCollapsed]
  );

  return (
    <div className={className} ref={divRef}>
      <div className="flex flex-row gap-1">
        <div className="grow truncate flex items-center px-4">
          <span className="font-bold truncate">{label}</span>
        </div>
        <button
          className="bg-transparent"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            props.onCollapse?.(!isCollapsed);
          }}
        >
          <Icon
            icon="material-symbols:arrow-drop-down"
            width="32px"
            className={isCollapsed ? "rotate-90" : "rotate-0"}
          />
        </button>
      </div>
      <div
        className={`shadow-inner ${
          isCollapsed ? "hidden" : "block flex-auto h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
});

export default Collapsible;
