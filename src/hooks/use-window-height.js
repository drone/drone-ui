import { useState, useLayoutEffect, useCallback } from 'react';

export default function useWindowHeight() {
  const [height, setHeight] = useState(() => window.innerHeight || 0);

  const resizeHandler = useCallback((e) => {
    setHeight(e.currentTarget.innerHeight);
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [resizeHandler]);

  return height;
}
