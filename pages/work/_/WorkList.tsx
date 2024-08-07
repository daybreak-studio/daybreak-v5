import React, { MutableRefObject, useRef, useTransition } from "react";
import WorkItem from "./WorkItem";
import InfiniteScrollArea from "./InfiniteScrollArea";
type Props = {};

const WORK_LIST = [
  { name: "superpower" },
  { name: "Flex" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
  { name: "Hypercard" },
];

const WorkList = (props: Props) => {
  return (
    <InfiniteScrollArea>
      {WORK_LIST.map(({ name }, index) => {
        return <WorkItem index={index} name={name} key={index} />;
      })}
    </InfiniteScrollArea>
  );
};

export default WorkList;
