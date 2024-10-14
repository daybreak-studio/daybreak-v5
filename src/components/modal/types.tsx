import { AnimationProps } from "framer-motion";
import React from "react";

interface Context {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  layoutId: string;
  id: string;
  path: string;
  isAnimating: boolean;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  isClosing: boolean;
  setIsClosing: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLDivElement>;
}

interface Root extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  path: string;
  transition?: AnimationProps["transition"];
}

interface Trigger extends React.HTMLAttributes<HTMLDivElement> {}

interface Portal extends React.HTMLAttributes<HTMLDivElement> {}

interface Background extends React.HTMLAttributes<HTMLDivElement> {}

interface Content extends React.HTMLAttributes<HTMLDivElement> {}

interface Item extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

export type { Background, Content, Context, Item, Portal, Root, Trigger };
