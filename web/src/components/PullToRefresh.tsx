import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Flex, Spinner } from "@chakra-ui/react"

interface PullToRefreshProps {
  isPullable?: boolean;
  onRefresh: () => Promise<any> | void;
  refreshingContent?: JSX.Element | string;
  pullDownThreshold?: number;
  maxPullDownDistance?: number;
  resistanceFactor?: number;
  backgroundColor?: string;
}

export const PullToRefresh = ({
  isPullable = true,
  onRefresh,
  children,
  pullDownThreshold = 67,
  maxPullDownDistance = 95,
  resistanceFactor = 5,
  backgroundColor
}: PropsWithChildren<PullToRefreshProps>) => {
  const childrenRef = useRef<HTMLDivElement>(null);
  const pullDownRef = useRef<HTMLDivElement>(null);

  const [pullToRefreshThresholdBreached, setPullToRefreshThresholdBreached] = useState(false);
  let isDragging = false;
  let startY = 0;
  let currentY = 0;

  useEffect(() => {
    console.log('**detected pull to refresh');
    if (!isPullable || childrenRef.current === null) {
      return;
    }

    console.log('**childrenRef.current', childrenRef.current);
    console.log('**children', children);

    const childrenElem = childrenRef.current;
    childrenElem.addEventListener('touchstart', onTouchStart, { passive: true });
    childrenElem.addEventListener('mousedown', onTouchStart);
    childrenElem.addEventListener('touchmove', onTouchMove, { passive: false });
    childrenElem.addEventListener('mousemove', onTouchMove);
    childrenElem.addEventListener('touchend', onTouchEnd);
    childrenElem.addEventListener('mouseup', onTouchEnd);
    childrenElem.addEventListener('mouseleave', onTouchEnd);

    return () => {
      childrenElem.removeEventListener('touchstart', onTouchStart);
      childrenElem.removeEventListener('mousedown', onTouchStart);
      childrenElem.removeEventListener('touchmove', onTouchMove);
      childrenElem.removeEventListener('mousemove', onTouchMove);
      childrenElem.removeEventListener('touchend', onTouchEnd);
      childrenElem.removeEventListener('mouseup', onTouchEnd);
      childrenElem.removeEventListener('mouseleave', onTouchEnd);
    };
  }, [children, isPullable, onRefresh, pullDownThreshold, maxPullDownDistance]);

  useEffect(() => {
    if (pullDownRef.current === null) {
      return;
    }

    pullDownRef.current.style.transform = '0.2s cubic-bezier(0, 0, 0.31, 1)';
    console.log('**added pulldown transform')
  }, [])

  const initContainer = (): void => {
    requestAnimationFrame(() => {
      /**
       * Reset Styles
       */
      if (childrenRef.current !== null) {
        childrenRef.current.style.overflowX = 'hidden';
        childrenRef.current.style.overflowY = 'auto';
        childrenRef.current.style.transform = `translate(0px, 0px)`;
      }
      if (pullDownRef.current !== null) {
        pullDownRef.current.style.opacity = '0';
      }

      if (pullToRefreshThresholdBreached) setPullToRefreshThresholdBreached(false);
    });
  };

  const onTouchStart = (e: MouseEvent | TouchEvent) => {
    isDragging = false;

    if (e instanceof MouseEvent) {
      startY = e.pageY;
    }

    if (e instanceof TouchEvent) {
      startY = e.touches[0]?.pageY;
    }

    currentY = startY;

    if (childrenRef.current!.getBoundingClientRect().top < 0) { // TODO: is this necessary?
      return;
    }
  
    isDragging = true;
  };

  const onTouchMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) {
      return;
    }

    if (e instanceof MouseEvent) {
      currentY = e.pageY;
    }

    if (e instanceof TouchEvent) {
      currentY = e.touches[0]?.pageY;
    }

    if (currentY < startY) {
      isDragging = false;
      return;
    }

    const yDistMoved = Math.min((currentY - startY) / resistanceFactor, maxPullDownDistance);

    if (yDistMoved >= pullDownThreshold) {
      setPullToRefreshThresholdBreached(true);
    }

    if (yDistMoved >= maxPullDownDistance) {
      return;
    }

    pullDownRef.current!.style.opacity = ((yDistMoved) / 65).toString();
    childrenRef.current!.style.overflow = 'visible';
    childrenRef.current!.style.transform = `translate(0px, ${yDistMoved}px)`;
    pullDownRef.current!.style.visibility = 'visible';
  };

  const onTouchEnd = async () => {
    isDragging = false;
    startY = 0;
    currentY = 0;

    // Need to figure how to reset pull down container if threshold not breached
    if (!pullToRefreshThresholdBreached) {
      if (pullDownRef.current) pullDownRef.current.style.visibility = 'hidden';
      initContainer();
      return;
    }

    if (childrenRef.current !== null) {
      childrenRef.current.style.overflow = 'visible';
      childrenRef.current.style.transform = `translate(0px, ${pullDownThreshold}px)`;
    }

    await onRefresh();
    initContainer();
  };

  return (
    <>
      <div ref={pullDownRef}>
        {pullToRefreshThresholdBreached ?
        <Flex flexDirection="row" justifyContent="center" alignItems="center" margin="0 auto">
          <Spinner thickness="6px"/>
        </Flex> : null}
      </div>
      <div ref={childrenRef}>{children}</div>
    </>
  )
};
