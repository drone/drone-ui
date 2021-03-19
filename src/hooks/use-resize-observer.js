import { useEffect, useCallback, useState } from 'react';

const config = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true,
};

const useResizeObserver = (
  callback,
  options = config,
) => {
  const [observable, setObservable] = useState(null);

  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (observable) {
      const observer = new ResizeObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(observable, options);
      return () => {
        observer.disconnect();
      };
    }
  }, [observable, callback, options]);

  const ref = useCallback((node) => {
    setObservable(node);
  }, []);

  return [ref];
};

export default useResizeObserver;
