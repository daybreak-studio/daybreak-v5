"use client";

import * as React from "react";
import * as Types from "./types";

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

const Context = React.createContext<Types.Context | undefined>(undefined);

const useModalContext = (): Types.Context => {
  const context = React.useContext(Context);

  if (context === undefined) {
    throw new Error("useModalContext must be used within a Root");
  }
  return context;
};

const Root = React.memo(
  React.forwardRef<HTMLDivElement, Types.Root>(
    (
      {
        id,
        path,
        transition = {
          ease: [0.19, 1, 0.22, 1],
          duration: 1,
        },
        ...props
      },
      ref,
    ) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [isAnimating, setIsAnimating] = React.useState(false);
      const [isClosing, setIsClosing] = React.useState(false);

      const layoutId = React.useRef(`modal-${uuidv4()}`).current;
      const router = useRouter();
      const { slug } = router.query;

      React.useEffect(() => {
        const currentSlug = Array.isArray(slug) ? slug[0] : slug;

        if (currentSlug === id) {
          setIsOpen(true);
          setIsClosing(false);
        } else {
          setIsOpen(false);
        }
      }, [slug, id]);

      return (
        <Context.Provider
          value={{
            isOpen,
            setIsOpen,
            layoutId,
            id,
            path,
            isAnimating,
            setIsAnimating,
            isClosing,
            setIsClosing,
          }}
        >
          <MotionConfig transition={transition}>
            <LayoutGroup>
              <div ref={ref} {...props} />
            </LayoutGroup>
          </MotionConfig>
        </Context.Provider>
      );
    },
  ),
);

const Trigger = React.memo(
  React.forwardRef<HTMLDivElement, Types.Trigger>(({ ...props }, ref) => {
    const {
      id,
      layoutId,
      isOpen,
      setIsOpen,
      isAnimating,
      setIsAnimating,
      isClosing,
      path,
    } = useModalContext();
    const router = useRouter();

    const handleClick = () => {
      if (isAnimating || isClosing) return;
      setIsOpen(true);
      router.replace(`${path}/${id}`, undefined, { shallow: true });
    };

    return (
      <motion.div
        ref={ref}
        className={props.className}
        style={props.style}
        layoutId={layoutId}
        onClick={handleClick}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {props.children}
      </motion.div>
    );
  }),
);

const Portal = React.memo(
  React.forwardRef<HTMLDivElement, Types.Portal>(({ ...props }, ref) => {
    const { isOpen } = useModalContext();
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            className={cn(
              "fixed inset-0 z-10 flex items-center justify-center",
              props.className,
            )}
          >
            {props.children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }),
);
Portal.displayName = "Modal.Portal";

const Background = React.memo(
  React.forwardRef<HTMLDivElement, Types.Background>(({ ...props }, ref) => {
    const { setIsOpen, isAnimating, path } = useModalContext();

    const router = useRouter();

    const handleClose = () => {
      if (isAnimating) return;
      setIsOpen(false);
      router.replace(path, undefined, { shallow: true });
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "fixed inset-0 bg-[#EBEBEB] bg-opacity-50 backdrop-blur-[16px]",
          props.className,
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      />
    );
  }),
);

const Content = React.memo(
  React.forwardRef<HTMLDivElement, Types.Content>(({ ...props }, ref) => {
    const { setIsOpen, layoutId } = useModalContext();
    return (
      <motion.div
        ref={ref}
        onClick={() => setIsOpen(false)}
        layoutId={layoutId}
        className={cn(props.className)}
        style={props.style}
      >
        {props.children}
      </motion.div>
    );
  }),
);
Content.displayName = "Modal.Content";

const Item: React.FC<Types.Item> = React.memo(({ id, ...props }) => {
  return (
    <motion.div layoutId={id} className={props.className} style={props.style}>
      {props.children}
    </motion.div>
  );
});
Item.displayName = "Modal.Item";

export { Background, Content, Item, Portal, Root, Trigger };
