import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

  // useEffect(() => {
  //   const className = 'dark';
  //   const bodyClass = window.document.body.classList;

  //   colorMode === 'dark'
  //     ? bodyClass.add(className)
  //     : bodyClass.remove(className);

    
  // }, [colorMode]);
  useEffect(() => {
    const bodyClass = document.body.classList;

    if (colorMode === 'dark') {
      bodyClass.add('dark');
    } else {
      bodyClass.remove('dark');
    }

    if (localStorage.getItem('color-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
