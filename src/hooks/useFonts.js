import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const useFonts = (fontMap) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync(fontMap);
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();
  }, [fontMap]);

  return [fontsLoaded]; 
};

export default useFonts;
