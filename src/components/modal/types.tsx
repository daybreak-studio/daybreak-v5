import { AnimationProps } from "framer-motion";
import React from "react";

interface Context {
  id: string;
  path: string;
  layoutId: string;

  isOpen: boolean;
  setIsOpen: (open: boolean) => void;

  isAnimating?: boolean;
  setIsAnimating: (animating: boolean) => void;

  isClosing?: boolean;
  setIsClosing: (closing: boolean) => void;
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
