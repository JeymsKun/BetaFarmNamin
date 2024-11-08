import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  let keyCounter = 0;

  const generateUniqueKey = () => {
    keyCounter++; 
    return `${Date.now()}-${keyCounter}`;
  };

  const addImage = async (uri, type) => {
    try {
      if (!uri) {
        console.error('Attempted to add an undefined URI');
        return;
      }
  
      console.log("Current images in state:", images);
      console.log("Adding image URI:", uri);
  
      const uniqueKey = generateUniqueKey(); 
      console.log("Adding new image:", { uri, type, key: uniqueKey });
      setImages((prev) => [...prev, { uri, type, selected: false, key: uniqueKey }]);
      return uniqueKey; 
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  const toggleImageSelection = (key) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.key === key ? { ...image, selected: !image.selected } : image
      )
    );
  
    setSelectedImages((prev) =>
      prev.includes(key)
        ? prev.filter((imageKey) => imageKey !== key)
        : [...prev, key]
    );
  };

  const deleteSelectedImages = (imageUris) => {
    setImages((prevImages) =>
      prevImages.filter((image) => !imageUris.includes(image.uri))
    );
    setSelectedImages([]); 
  };

  const updateImage = (originalImageUri, newImageUri) => {
    if (!originalImageUri || !newImageUri) {
      console.error('Original or new image URI is undefined');
      return;
    }

    setImages((prevImages) =>
      prevImages.map((image) =>
        image.uri === originalImageUri ? { ...image, uri: newImageUri } : image
      )
    );
  };

  const clearSelection = () => {
    setSelectedImages([]);
    setImages((prevImages) =>
      prevImages.map((image) => ({ ...image, selected: false }))
    );
  };

  const addCroppedImage = (newCroppedUri) => {
    console.log("Current images in state for cropped image:", images);
    console.log("Adding cropped image URI:", newCroppedUri);
  
    const isOriginalImage = images.some(image => image.uri === newCroppedUri);
    if (!isOriginalImage) {
        const uniqueKey = generateUniqueKey(); 
        console.log("Adding new cropped image:", { uri: newCroppedUri, key: uniqueKey });
        setImages((prev) => [
            ...prev,
            { uri: newCroppedUri, selected: false, key: uniqueKey },
        ]);
        return uniqueKey;
    } else {
        console.log("Duplicate cropped image found. Showing alert.");
        setIsCustomAlertVisible(true);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        addImage,
        addCroppedImage,
        toggleImageSelection,
        deleteSelectedImages,
        updateImage,
        selectedImages,
        clearSelection,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};
