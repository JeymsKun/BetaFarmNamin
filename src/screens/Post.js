import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import CustomAlert from '../components/CustomAlert';
import { v4 as uuidv4 } from 'uuid';

const { width, height } = Dimensions.get('window');

const MAX_LENGTH = 50;

export default function Post({ navigation, route }) {
  const { postToEdit } = route.params || {};
  const [productLocation, setProductLocation] = useState(postToEdit?.location || '');
  const [productDescription, setProductDescription] = useState(postToEdit?.nameDescriptionTitle || '');
  const [images, setImages] = useState(postToEdit?.images || []);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const [showInfoMessageAdditional, setShowInfoMessageAdditional] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState(false);
  const [focusedDescription, setFocusedDescription] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState([]);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isAddPostConfirmationVisible, setIsAddPostConfirmationVisible] = useState(false);

  useEffect(() => {
    if (postToEdit) {
        setProductLocation(postToEdit.location);
        setProductDescription(postToEdit.nameDescriptionTitle);
        setImages(postToEdit.images.map(image => ({
            uri: image.uri || '', 
            type: image.type || 'image', 
            name: image.name || 'Uploaded Media', 
        })) || []);
    }
}, [postToEdit]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const additionalDetailsFromRoute = navigation.getState().routes.find(route => route.name === 'ProductPost')?.params?.additionalDetails;
      if (additionalDetailsFromRoute) {
        setAdditionalDetails(additionalDetailsFromRoute);
        const initialDetailValues = {};
        const initialFocusedDetails = {};
        additionalDetailsFromRoute.forEach(detail => {
          initialDetailValues[detail] = ''; 
          initialFocusedDetails[detail] = false; 
        });
        setDetailValues(initialDetailValues);
        setFocusedDetails(initialFocusedDetails); 
      }
    });

    return unsubscribe;
  }, [navigation]);
  
  useEffect(() => {
    const clearMessage = () => {
      setShowInfoMessage(false);
      setShowInfoMessageAdditional(false);
    };

    let timer;
    if (showInfoMessage || showInfoMessageAdditional) {
      timer = setTimeout(clearMessage, 4000); 
    }

    return () => clearTimeout(timer); 
  }, [showInfoMessage, showInfoMessageAdditional]);

  const renderHeader = () => (
    <View style={styles.header}>

      <Text style={styles.headerTextTop}>Welcome to</Text>

      <View style={styles.headerRow}>
        <View style={styles.rowProductTitle}>
          <Text style={styles.headerTextBottom}>Product Management Tool</Text>
          <TouchableOpacity style={styles.questionInfo} onPress={() => setShowInfoMessage((prev) => !prev)}>
            <AntDesign 
              name="questioncircleo" 
              size={12} 
              color="white" 
              style={styles.iconSpacing} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {showInfoMessage && (
        <View style={styles.infoMessage}>
          <Text style={styles.infoText}>
            This Product Management Tool allows you to manage your products efficiently. You can add, edit, and delete products as needed.
          </Text>
        </View>
      )}
    </View>
  );

  useEffect(() => {
    if (additionalDetails.length > 0) {
      const newAnimations = additionalDetails.map(() => new Animated.Value(0));
      setAnimations(newAnimations);
    }
  }, [additionalDetails]);

  const handleDescriptionChange = (text) => {
    if (text.length <= MAX_LENGTH) {
      setProductDescription(text);
    }
  };

  const handleDeleteMediaItem = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDone = () => {
    if (images.length === 0 || productDescription.trim() === '' || productLocation.trim() === '') {
      setIsAlertVisible(true);
    } else {
      setIsConfirmationModalVisible(true); 
    }
  };


  const handleConfirm = () => {
    setIsConfirmationModalVisible(false);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const updatedPost = {
        id: postToEdit ? postToEdit.id : uuidv4(),
        images: images.map(image => image.uri), 
        nameDescriptionTitle: productDescription,
        location: productLocation,
      };
      navigation.navigate('Product', { updatedPost });
    }, 3000);
  };
  

  const handleCancel = () => {
    setIsConfirmationModalVisible(false); 
  };

  const renderAlertMessage = () => {
    if (images.length === 0) {
      return 'Your Photo is empty';
    } else if (productDescription.trim() === '') {
      return 'Your Name, Description, or Title is empty';
    } else if (productLocation.trim() === '') {
      return 'Your Location is empty';
    }
  };

  const handleDeletePost = () => {
    setIsDeleteConfirmationVisible(true);
  };

  const confirmDeletePost = () => {
    setIsDeleteConfirmationVisible(false);
    setProductDescription('');
    setProductLocation('');
    setImages([]);
  };

  const handleAddNewPost = () => {
    setIsAddPostConfirmationVisible(true);
  };

  const confirmAddNewPost = () => {
    setIsAddPostConfirmationVisible(false);
    setProductDescription('');
    setProductLocation('');
    setImages([]);
    setFocusedDescription(false);
    setFocusedLocation(false);
  };

  const renderMediaList = () => {
    if (images.length === 0) {
      return (
        <View style={styles.mediaListContainer}>
          <TouchableOpacity style={styles.mediaListButton} onPress={handleOpenGallery}>
            <View style={styles.mediaListIconContainer}>
              <AntDesign name="camera" size={24} color="#2D8D2B" />
            </View>
            <Text style={styles.mediaListButtonText}>Add Photo Only</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    return (
      <ScrollView contentContainerStyle={styles.mediaScrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {images.map((item, index) => (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} key={index}>
            <TouchableOpacity key={`${item.uri}-${index}`} style={styles.mediaItemContainer} onPress={() => handlePressMediaItem(item)}>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMediaItem(index)}>
                <AntDesign name="delete" size={20} color="#FF0000" />
              </TouchableOpacity>
              <View style={[styles.mediaDetailsRow, { flexDirection: 'row', alignItems: 'center' }]}>
                {item.type === 'video' ? (
                  <Feather name="video" size={25} color="#333" style={styles.mediaIcon} />
                ) : (
                  <Feather name="image" size={25} color="#333" style={styles.mediaIcon} />
                )}
                <Text style={styles.mediaFileName}>{item.name || 'Uploaded Media'}</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        ))}
  
        {renderImageActionButtons()}
      </ScrollView>
    );
  };
  
  const renderImageActionButtons = () => (
    <View style={styles.actionButtonsImage}>
      <TouchableOpacity style={styles.addButtonImage} onPress={handleOpenGallery}>
        <Text style={styles.buttonTextImage}>Add Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButtonImage} onPress={handleOpenCamera}>
        <Text style={styles.buttonTextImage}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePressMediaItem = (item) => {
    console.log('Media Item:', item);
    if (item.type === 'image' || item.type === 'video') {
        navigation.navigate('ImageViewer', { uri: item.uri });
    } else {
        console.warn('Unsupported document type:', item.type); 
    }
  };

  const handleOpenGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);

    if (!result.canceled) {
      setImages((prevImages) => [
        ...prevImages,
        {
          uri: result.assets[0].uri,
          type: result.assets[0].type,
          name: result.assets[0].fileName || 'Uploaded Media',
        },
      ]);
    }
  };

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission to access camera is required!');
        return;
    }

    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
        setImages((prevImages) => [
            ...prevImages,
            {
                uri: result.assets[0].uri,
                type: result.assets[0].type,
                name: result.assets[0].fileName || 'Uploaded Media',
            },
        ]);
    } else {
        console.log('Camera was canceled');
    }
  };
  
  return (
    <>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <StatusBar hidden={false} />
        <View style={styles.productContainer}>
          <View style={styles.actionButtons}>
            <Text style={styles.sectionTitlePost}>Create Post</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddNewPost}>
              <View style={styles.iconTextRow}>
                <AntDesign name="pluscircleo" size={20} color="black" />
                <Text style={styles.buttonText}>Add New Post</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePost}>
              <View style={styles.iconTextRow}>
                <AntDesign name="delete" size={20} color="black" />
                <Text style={styles.buttonText}>Delete Post</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Placeholder with Dynamic Height */}
        <View style={styles.imagePlaceholder}>
          {renderMediaList()}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitles}>Name, Description, or Title</Text>
          <View style={[styles.inputWrapperDescription, focusedDescription && productDescription.length === 0 && styles.errorBorder]}>
            <TextInput
              style={styles.inputDescription}
              placeholder="Add Name, Description, or Title"
              value={productDescription}
              onChangeText={handleDescriptionChange}
              multiline
              scrollEnabled={false} 
              onBlur={() => setFocusedDescription(true)}
            />
            <Text style={[styles.characterCount, focusedDescription && productDescription.length === 0 && styles.errorCharacterCount]}>
              {`${productDescription.length}/${MAX_LENGTH}`}
            </Text>
          </View>
          <Text style={styles.inputTitles}>Location</Text>
          <View style={[styles.inputWrapper, focusedLocation && productLocation.length === 0 && styles.errorBorder]}>
            <TextInput
              style={styles.input}
              placeholder="Add Location"
              value={productLocation}
              onChangeText={setProductLocation}
              onBlur={() => setFocusedLocation(true)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Done Button at the bottom */}
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneText}>Done</Text>
          <Feather name="arrow-right" size={30} color="#28B805" />
        </TouchableOpacity>
      </View>

        {/* Confirmation Modal */}
        <Modal visible={isConfirmationModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to {postToEdit ? 'update' : 'post'} this?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                  <Text style={styles.modalButtonTextYes}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                  <Text style={styles.modalButtonTextNo}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <CustomAlert 
          visible={isAlertVisible} 
          title="Empty Input" 
          message={renderAlertMessage()} 
          onClose={() => setIsAlertVisible(false)} 
        />

        {/* Loading Modal */}
        <Modal visible={isLoading} transparent={true} animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
                <ActivityIndicator size={50} color="#4CAF50" />
              <Text style={{ marginTop: 10, fontFamily: 'Poppins-Medium', color: 'white' }}>Uploading Photo...</Text>
            </View>
          </View>
        </Modal>

        {/* Add New Post Confirmation Modal */}
        <Modal visible={isAddPostConfirmationVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to add a new post?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={confirmAddNewPost}>
                  <Text style={styles.modalButtonTextYes}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsAddPostConfirmationVisible(false)}>
                  <Text style={styles.modalButtonTextNo}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal visible={isDeleteConfirmationVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to delete all posts?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={confirmDeletePost}>
                  <Text style={styles.modalButtonTextYes}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsDeleteConfirmationVisible(false)}>
                  <Text style={styles.modalButtonTextNo}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
  },
  header: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: height * 0.08,
    backgroundColor: '#4CAF50', 
    padding: width * 0.02,
    zIndex: 10, 
  },
  headerTextTop: {
    fontSize: width > 400 ? 16 : 12,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    paddingHorizontal: 10, 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10, 
  },  
  rowProductTitle: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    flexWrap: 'wrap',
  },
  iconSpacing: {
    padding: 5,
  },
  headerTextBottom: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  infoMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    textAlign: 'center',
    width: '90%',
    height: height * 0.1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 1,
    elevation: 3, 
    zIndex: 10, 
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#333',

  },
  infoMessageAdditional: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    bottom: 25,
    width: '90%',
    height: height * 0.25,
    borderRadius: 5,
    padding: 10,
    elevation: 3, 
    zIndex: 10,
  },
  sectionTitlePost: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'black',
    padding: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  actionButtonsImage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonImage: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonTextImage: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium'
  },
  productContainer: {
    alignItems: 'center',
    margin: 50,
    borderRadius: 5, 
  },
  imagePlaceholder: {
    backgroundColor: 'rgba(27, 164, 15, 0.31)',
    borderRadius: 5,
    padding: 10,
    marginTop: -45,
    overflow: 'hidden',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: 'rgba(27, 164, 15, 0.31)',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputWrapperDescription: {
    marginBottom: 25,
    backgroundColor: 'rgba(27, 164, 15, 0.31)',
    borderRadius: 5,
    height: 100,
  },
  inputDescription: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginHorizontal: 8,
    padding: 10,
    flex: 1, 
    textAlignVertical: 'top',
  },
  input: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginHorizontal: 8,
    padding: 10,
    flex: 1, 
  },
  characterCount: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'right',
    padding: 5, 
    color: 'gray',
    marginTop: 5,
  },
  doneButton: {
    flexDirection: 'row',
    padding: 5,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'center',
    padding: 10,
    
  },
  doneText: {
    padding: 5,
    fontSize: 14,
    color: "#28B805",  
    fontFamily: 'Poppins-Bold',
  },
  mediaDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaIcon: {
     marginLeft: 10,
  },
  mediaFileName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginLeft: 10,
  },
  mediaScrollContainer: {
    alignItems: 'center', 
    paddingVertical: 10, 
  },
  mediaItemContainer: {
    backgroundColor: 'rgba(27, 164, 15, 0.31)', 
    padding: 10,
    marginHorizontal: 5, 
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%', 
    marginBottom: 10,
  },
  mediaListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(27, 164, 15, 0.31)',
    borderRadius: 5,
    height: 100,
  },
  mediaListButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  mediaListIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  mediaListButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  inputTitles: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: '#F44336',
  },
  errorCharacterCount : {
    color: '#F44336',
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonTextYes: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: 'Poppins-Medium',
  },
  modalButtonTextNo: {
    fontSize: 14,
    color: '#F44336',
    fontFamily: 'Poppins-Medium',
  },
 
});
