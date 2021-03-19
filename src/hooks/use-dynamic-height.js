import { useCallback, useState } from 'react';

import useWindowHeight from './use-window-height';

export default function useDynamicHeight(customHeightSetter = (val) => val) {
  const [dynamicHeight, setDynamicHeight] = useState(() => customHeightSetter(500)); // min-height value
  const height = useWindowHeight();
  const dynamicHeightRef = useCallback(
    (node) => {
      if (node !== null) {
        const newValue = height - node.getBoundingClientRect().top;
        setDynamicHeight(customHeightSetter(newValue));
      }
    },
    [height, customHeightSetter],
  );

  return { dynamicHeight, dynamicHeightRef };
}
