import React from "react";
import { GridSystem } from "./GridSystem";
import { Widget } from "./Widget";

export const Dashboard: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-5xl">
        <GridSystem>
          <Widget size="large" />
          <Widget size="medium" />
          <Widget size="small" />
          <Widget size="small" />
          <Widget size="small" />
          <Widget size="small" />
          <Widget size="small" />
          <Widget size="medium" />
          <Widget size="large" />
          <Widget size="small" />
          <Widget size="small" />
          <Widget size="small" />
          <Widget size="small" />
        </GridSystem>
      </div>
    </div>
  );
};
