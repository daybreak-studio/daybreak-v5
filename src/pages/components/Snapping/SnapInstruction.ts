// Contains logic for determining snap instructions based on scroll position and velocity.

import Lenis from "lenis";
import { SnapPoint } from "./SnapPoint";

interface SnapInstruction {
  alignment: "top" | "bottom";
  position: number;
}

export function performSnap(lenis: Lenis, snapPoints: SnapPoint[]) {
  const vel = lenis.direction;
  const target = lenis.targetScroll;
  const snapInstruction = getSnapInstruction(snapPoints, target, vel);
  if (!snapInstruction) return;

  const nearest = snapInstruction.position;
  if (snapInstruction.alignment === "top") {
    lenis.scrollTo(nearest, { lerp: 0.1 });
  } else {
    lenis.scrollTo(Math.max(0, nearest - window.innerHeight), { lerp: 0.1 });
  }
}

export function getSnapInstruction(
  points: SnapPoint[],
  scrollPosition: number,
  scrollVelocity: number,
  snapMargin = window.innerHeight,
  enterThreshold = 0.85,
  exitThreshold = 0.2,
): SnapInstruction | undefined {
  let snapInstruction: SnapInstruction | undefined;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const distToPoint = point.position - scrollPosition;
    const hasPastPoint = distToPoint < 0;
    const isHeadingTowardPoint = distToPoint * scrollVelocity > 0;

    if (
      hasPastPoint &&
      distToPoint < window.innerHeight &&
      isHeadingTowardPoint
    ) {
      snapInstruction = {
        position: point.position,
        alignment: "top",
      };
      continue;
    }

    if (Math.abs(distToPoint) > snapMargin || hasPastPoint) continue;

    const snapOverlap = Math.abs(distToPoint / snapMargin);

    if (
      (isHeadingTowardPoint && snapOverlap < enterThreshold) ||
      (!isHeadingTowardPoint && snapOverlap < exitThreshold)
    ) {
      snapInstruction = {
        position: point.position,
        alignment: "top",
      };
      continue;
    }

    snapInstruction = {
      position: point.position,
      alignment: "bottom",
    };
  }

  return snapInstruction;
}
