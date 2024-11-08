  import React, { useEffect, useState, useCallback } from 'react';
  import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
  import { Picker } from '@react-native-picker/picker'; 
  import { useNavigation } from '@react-navigation/native';
  import { useImageContext } from '../context/ImageContext';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import { CheckBox } from 'react-native-elements';
  import * as ImagePicker from 'expo-image-picker';
  import * as ImageManipulator from 'expo-image-manipulator';
  import * as VideoThumbnails from 'expo-video-thumbnails';
  import * as MediaLibrary from 'expo-media-library';
  import * as DocumentPicker from 'expo-document-picker';

  const ImageItem = React.memo(({ item, handleImageSelect, isImageLoading, isSelectMode, isSelected, toggleSelect }) => {
    const [thumbnail, setThumbnail] = useState(null);
  
    useEffect(() => {
      const generateThumbnail = async () => {
        if (item.mediaType === 'video') {
          try {
              const { uri } = await VideoThumbnails.getThumbnailAsync(item.uri, { time: 1000 });
              setThumbnail(uri);
          } catch (error) {
              console.error('Error generating thumbnail:', error);
          }
        }
      };
      generateThumbnail();
    }, [item]);
  
    return (
      <TouchableOpacity 
        style={[styles.imageItem, isSelected && styles.selectedImage]} 
        onPress={() => isSelectMode ? toggleSelect(item.uri) : handleImageSelect(item.uri)}
      >
        {isImageLoading ? (
          <View style={styles.imageLoading}>
              <ActivityIndicator size={40} color="#228B22" /> 
          </View>
        ) : (
            <>
              {item.mediaType === 'video' ? (
                <View style={styles.videoPreview}>
                  {thumbnail ? (
                      <Image source={{ uri: thumbnail }} style={styles.videoThumbnail} />
                  ) : (
                      <ActivityIndicator size={30} color="white" />
                  )}
                  <Ionicons name="play-circle" size={30} color="white" style={styles.playIcon} />
                </View>
              ) : (
                  <Image source={{ uri: item.uri }} style={styles.imagePreview} />
              )}
              {isSelectMode && (
                <CheckBox
                  checked={isSelected}
                  onPress={() => toggleSelect(item.uri)}
                  containerStyle={styles.checkboxContainer}
                  checkedIcon={<Ionicons name="checkbox" size={24} color="yellow" />}
                  uncheckedIcon={<Ionicons name="checkbox-outline" size={24} color="white" />}
                />
              )}
            </>
          )}
      </TouchableOpacity>
    );
});
  
  const ImageCaptureAPI = () => {
    const navigation = useNavigation();
    const { addImage, updateImage } = useImageContext();
    const [hasPermission, setHasPermission] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState('all');
    const [lastAssetId, setLastAssetId] = useState(null);
    const [imageLoading, setImageLoading] = useState({});
    const [selectMode, setSelectMode] = useState(false);  
    const [selectedImages, setSelectedImages] = useState([]); 
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [pendingCroppedImage, setPendingCroppedImage] = useState(null);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false); 
    const [isConfirmationModalVisibleForUpload, setIsConfirmationModalVisibleForUpload] = useState(false);
    const [selectedFileForUpload, setSelectedFileForUpload] = useState(null);

    useEffect(() => {
      const getPermissionsAndLoadAlbums = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setHasPermission(status === 'granted');

        if (status === 'granted') {
          await loadAlbums();
        }
      };

      getPermissionsAndLoadAlbums();
    }, []);

    const loadAlbums = async () => {
      try {
        const albumsData = await MediaLibrary.getAlbumsAsync();
        setAlbums([{ id: 'all', title: 'All' }, ...albumsData]);
        if (albumsData.length > 0) {
          await loadImagesFromAlbum('all');
        }
      } catch (error) {
        console.error("Error loading albums:", error);
      }
    };

    const loadImagesFromAlbum = async (albumId, after = null) => {
      if (loadingMore) return; 
    
      setLoadingMore(true);
      try {
        let options = {
          mediaType: ['photo', 'video'],
          first: 50,  
          after: after,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]], 
        };
    
        if (albumId !== 'all') {
          options.album = albumId;
        }
    
        const { assets: newAssets, endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync(options);

        const uniqueAssets = newAssets.filter(asset => !images.some(existing => existing.id === asset.id));
    
        setImages(prevImages => after ? [...prevImages, ...uniqueAssets] : uniqueAssets);
        setLastAssetId(hasNextPage ? endCursor : null);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setSelectMode(false);
      }
    };

    const handleOpenGallery = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
  
        if (!result.canceled && result.assets.length > 0) {
          const { uri, width, height } = result.assets[0];
          const croppedUri = await cropImage(uri, 0, 0, width, height);
          setPendingCroppedImage(croppedUri);
          setIsConfirmationModalVisible(true);
        }
      } catch (error) {
        console.error('Error opening gallery:', error);
      }
    };

    const handleUploadFile = async () => {
      try {
        setLoading(true);
    
        const result = await DocumentPicker.getDocumentAsync({
          type: ['image/*', 'video/*'], 
          copyToCacheDirectory: true,
        });
    
        console.log('Result:', result);
    
        if (result.canceled) {
          console.log('User  canceled the picker.');
          return; 
        }

        const asset = result.assets[0];
    
        const { uri, mimeType, name } = asset;
    
        console.log(`Selected File: ${name}, Type: ${mimeType}`);

        const type = mimeType.startsWith('video') ? 'video' : 'photo';
        addImage(uri, type); 

        navigation.navigate('Product', {
          selectedMedia: { uri, mimeType },
        });
      } catch (error) {
        console.error('Error picking document:', error);
      } finally {
        setLoading(false); 
      }
    };

    const handleAddFileForUpload = async () => {
      if (selectedFileForUpload) {
        try {
          const type = selectedFileForUpload.mimeType.startsWith('video') ? 'video' : 'photo';
          addImage(selectedFileForUpload.uri, type); 
          navigation.navigate('Product', {
            selectedMedia: selectedFileForUpload,
          });
        } catch (error) {
          console.error('Error adding or updating image:', error);
        } finally {
          setIsConfirmationModalVisibleForUpload(false);
          setSelectedFileForUpload(null);
        }
      }
    };
    
    const cropImage = async (uri, originX, originY, width, height) => {
      try {
        const cropped = await ImageManipulator.manipulateAsync(
          uri,
          [{ crop: { originX, originY, width, height } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG, aspect: [1, 1] }
        );
    
        return cropped.uri;
      } catch (error) {
        console.error('Error cropping image:', error);
        return uri;
      }
    };

    const handleAddCroppedImage = async () => {
      if (pendingCroppedImage) {
        try {
          const originalUri = pendingCroppedImage; 
          await Promise.all([
            addImage(pendingCroppedImage), 
            updateImage(originalUri, pendingCroppedImage),
          ]);
          navigation.navigate('Product');
        } catch (error) {
          console.error('Error adding or updating image:', error);
        } finally {
          setIsConfirmationModalVisible(false);
          setPendingCroppedImage(null);
        }
      }
    };
    

    const handleImageSelect = useCallback((uri) => {
      addImage(uri);
      navigation.navigate('Product');
    }, [addImage, navigation]);

    const onAlbumChange = async (albumId) => {
      setSelectedAlbum(albumId);
      setLastAssetId(null);
      setImages([]); 
      setLoading(true); 
      setSelectMode(false);
      await loadImagesFromAlbum(albumId); 
    };

    const toggleSelect = (uri) => {
      setSelectedImages((prevSelected) => {
        if (prevSelected.includes(uri)) {
          return prevSelected.filter((image) => image !== uri);
        } else {
          return [...prevSelected, uri];
        }
      });
    };

    const toggleSelectMode = () => {
      setSelectMode((prev) => {
        if (prev) {
            setSelectedImages([]);
        }
        return !prev; 
      });
    };

    const handleAddSelectedImages = () => {
      if (selectedImages.length > 0) {
        selectedImages.forEach((uri) => addImage(uri)); 
        navigation.navigate('Product');
      }  
    };

    if (hasPermission === null) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={40} color="#228B22" />
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No access to gallery</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#228B22" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add New Image</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAlbum}
            style={styles.picker}
            onValueChange={async (itemValue) => {
              onAlbumChange(itemValue);
            }}
            itemStyle={styles.pickerItem}
          >
            {albums.map((album) => (
              <Picker.Item key={album.id} label={album.title} value={album.id} />
            ))}
          </Picker>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleSelectMode}>
                <Text style={styles.buttonText}>{selectMode ? 'Cancel' : 'Select'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleOpenGallery}>
                <Text style={styles.buttonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleUploadFile}>
              <Text style={styles.buttonText}>Upload File</Text>
            </TouchableOpacity>
            </View>
          </View>

        {loading ? (
          <ActivityIndicator size={40} color="green" style={styles.loadingIndicator} />
        ) : (
          <FlatList
            data={images}
            renderItem={({ item, index }) => (
              <ImageItem
                item={item}
                handleImageSelect={handleImageSelect}
                isImageLoading={imageLoading[index]}
                isSelectMode={selectMode} 
                isSelected={selectedImages.includes(item.uri)} 
                toggleSelect={toggleSelect}
              />
            )}
            keyExtractor={(item) => item.id.toString()} 
            showsVerticalScrollIndicator={false}
            style={styles.imageList}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            onEndReachedThreshold={0.5}
            onEndReached={async () => {
              if (lastAssetId) {
                await loadImagesFromAlbum(selectedAlbum, lastAssetId);
              }
            }}
            ListFooterComponent={loadingMore ? <ActivityIndicator size={40} color="#228B22" style={styles.footerLoading} /> : null}
          />
        )}

        {images.length === 0 && !loading && (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImagesText}>No images found on this album.</Text>
            <Text style={styles.noImagesTextRefresh}>Please refresh this album..</Text>
          </View>
        )}

      <Modal
        visible={isConfirmationModalVisibleForUpload}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsConfirmationModalVisibleForUpload(false)} 
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedFileForUpload && selectedFileForUpload.mimeType.startsWith('video')
                ? 'Are you sure you want to add this video?'
                : 'Are you sure you want to add this image?'}
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonModal} onPress={handleAddFileForUpload}>
                <Text style={styles.modalButtonTextModal}>Add File</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonModal} onPress={() => setIsConfirmationModalVisibleForUpload(false)}>
                <Text style={styles.modalButtonTextModal}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Directly call handleAddSelectedImages when selecting images */}
      {selectMode && selectedImages.length > 0 && (
          <TouchableOpacity style={styles.modalButton} onPress={handleAddSelectedImages}>
              <Text style={styles.modalButtonText}>Add Selected Images</Text>
          </TouchableOpacity>
      )}

      {/* Modal for confirmation to add cropped image */}
      <Modal
          visible={isConfirmationModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsConfirmationModalVisible(false)} 
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to add this cropped image?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButtonModal} onPress={handleAddCroppedImage}>
                  <Text style={styles.modalButtonTextModal}>Add Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonModal} onPress={() => setIsConfirmationModalVisible(false)}>
                  <Text style={styles.modalButtonTextModal}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#C2FFC0',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 10,
    },
    headerText: {
      fontSize: 16, 
      color: '#228B22', 
      marginLeft: 90, 
      fontFamily: 'Poppins-Medium',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#4ED25B', 
      width: 70,
      height: 30, 
      padding: 8,
      borderRadius: 20,
      marginLeft: 10,
    },
    buttonText: {
      color: '#FFFFFF', 
      fontFamily: 'Poppins-Medium', 
      textAlign: 'center',
      fontSize: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#4ED25B',
    },
    picker: {
      height: 5,
      flex: 1,
      color: 'black',
    },
    imageItem: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#4ED25B', 
      overflow: 'hidden',
      backgroundColor: '#D3E7D3',
      position: 'relative', 
    },
    videoPreview: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoThumbnail: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
    },
    playIcon: {
      position: 'absolute',
    },
    selectedImage: {
      borderColor: 'yellow', 
      borderWidth: 2,
    },
    imagePreview: {
      width: '100%',
      height: 100,
    },
    imageLoading: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 100,
    },
    imageList: {
      width: '100%',
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    loadingIndicator: {
      marginTop: 20,
    },
    noImageContainer: {
      flex: 1,
      alignContent: 'center',
      padding: 10,
    },
    noImagesText: {
      textAlign: 'center',
      fontSize: 18,
      color: 'gray',
      fontFamily: 'Poppins-Bold',
    },
    noImagesTextRefresh: {
      textAlign: 'center',
      fontSize: 12,
      color: 'gray',
      fontFamily: 'Poppins-Bold',
    },
    footerLoading: {
      marginVertical: 20,
    },
    checkbox: {
      position: 'absolute',
      top: 5,
      right: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', 
    },
    modalContent: {
      width: '90%', 
      padding: 20,
      borderRadius: 10,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'Poppins-Medium',
    },
    modalButton: {
      backgroundColor: '#4ED25B', 
      height: 35,  
      padding: 5,
      borderRadius: 20,
      marginVertical: 10,
      width: '100%',
      alignItems: 'center',
    },
    modalButtonModal: {
      backgroundColor: '#4ED25B',
      height: 30,  
      padding: 5,
      borderRadius: 20,
      flex: 1, 
      marginHorizontal: 20,
    },
    modalButtonText: {  
      color: 'white',
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
    },
    modalButtonContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between',
      width: '90%', 
    },
    modalButtonTextModal: {  
      color: 'white',
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
    },
    checkboxContainer: {
      position: 'absolute', 
      top: -10,
      left: -15,
      borderColor: 'transparent', 
      borderRadius: 4,
      padding: 5,
      backgroundColor: 'transparent',
    },
  });

  export default ImageCaptureAPI;
