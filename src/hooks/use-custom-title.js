import { useEffect } from 'react';

export default function useCustomTitle(customTitle = '', defaultTitle = 'Drone CI') {
  useEffect(() => {
    document.querySelector('title').innerText = `${customTitle}${customTitle ? ' - ' : ''}${defaultTitle}`;
  }, [customTitle, defaultTitle]);
}
