import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const useFonts = (fontMap) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(fontMap);
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  return fontsLoaded;
};

export default useFonts;
