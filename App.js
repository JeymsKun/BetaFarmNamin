import React from 'react';
import { ImageProvider } from './src/context/ImageContext';
import AppNav from './src/navigation/AppNav'; 

export default function App() {
  return (
    <ImageProvider>
      <AppNav />
    </ImageProvider>
  );
}
