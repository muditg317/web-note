import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const p5Events = [
  "setup",
  "draw",
  "windowResized",
  "preload",
  "mouseClicked",
  "doubleClicked",
  "mouseMoved",
  "mousePressed",
  "mouseWheel",
  "mouseDragged",
  "mouseReleased",
  "keyPressed",
  "keyReleased",
  "keyTyped",
  "touchStarted",
  "touchMoved",
  "touchEnded",
  "deviceMoved",
  "deviceTurned",
  "deviceShaken",
];

export default function Sketch(props: any) {
  const {
    width,
    height,
    id,
    className = "react-p5",
    style,
    ...events
  } = props;

  const canvasParentRef = useRef<HTMLDivElement>();
  const sketchRef = useRef<p5>();

  useEffect(() => {
    if (!sketchRef.current) {
      // console.log('create new sketch');
      sketchRef.current = new p5(p => {
        // console.log(events);
        p5Events.forEach((event) => {
          if (events[event]) {
            p[`_internal_${event}`] = events[event];
            p[event] = (...args: any[]) => {
              p[`_internal_${event}`](p, ...args);
            };
          }
        });
      }, canvasParentRef.current);
    } else {
      // console.log('update sketch');
      p5Events.forEach((event) => {
        // @ts-ignore
        if (events[event] && events[event] !== sketchRef.current[`_internal_${event}`]) {
          // console.log(event,"changed");
          // @ts-ignore
          sketchRef.current[`_internal_${event}`] = events[event];
        }
      });
    }
  }, [events]);

  useEffect(() => {
    return () => {
      sketchRef.current!.remove();
    }
  }, []);

  return <div
      ref={canvasParentRef}
      { ...{
        width,
        height,
        id,
        className,
        style
      }}
    />;
};