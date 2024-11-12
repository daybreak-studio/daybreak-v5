import { ReactNode } from "react";

export interface Context {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  layoutId: string;
  id: string;
  path: string;
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
  isClosing: boolean;
  setIsClosing: (value: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

export interface Root extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  path: string;
  transition?: {
    ease?: number[];
    duration?: number;
  };
}

export interface Trigger extends React.HTMLAttributes<HTMLDivElement> {}

export interface Portal extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface Content extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface Background extends React.HTMLAttributes<HTMLDivElement> {}

export interface Item extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}
