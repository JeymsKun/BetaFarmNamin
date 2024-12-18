import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import CustomAlert from '../components/CustomAlert';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

const { width, height } = Dimensions.get('window');

const MAX_LENGTH = 250;
const INPUT_HEIGHT = 150;

export default function Product({ navigation, route }) {
  const { productToEdit } = route.params || {};
  const [productName, setProductName] = useState(productToEdit?.name || '');
  const [productPrice, setProductPrice] = useState(productToEdit?.price || '');
  const [productLocation, setProductLocation] = useState(productToEdit?.location || '');
  const [productDescription, setProductDescription] = useState(productToEdit?.nameDescriptionTitle || '');
  const [images, setImages] = useState(productToEdit?.images || []);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const [inputHeight, setInputHeight] = useState(INPUT_HEIGHT);
  const [showInfoMessageAdditional, setShowInfoMessageAdditional] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [focusedName, setFocusedName] = useState(false);
  const [focusedProductPrice, setFocusedPrice] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState(false);
  const [focusedDescription, setFocusedDescription] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState([]);
  const [detailValues, setDetailValues] = useState({});
  const [focusedDetails, setFocusedDetails] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [animations, setAnimations] = useState([]);
  const xIconRotation = useRef(new Animated.Value(0)).current;
  const [showNoDetailsMessage, setShowNoDetailsMessage] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isAddPostConfirmationVisible, setIsAddPostConfirmationVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    if (productToEdit) {
        setProductName(productToEdit.name);
        setProductPrice(productToEdit.price);
        setProductLocation(productToEdit.location);
        setProductDescription(productToEdit.nameDescriptionTitle);
        setImages(productToEdit.images.map(image => ({
            uri: image.uri || '', 
            type: image.type || 'image', 
            name: image.name || 'Uploaded Media', 
        })) || []);
    }
  }, [productToEdit]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const additionalDetailsFromRoute = route.params?.additionalDetails || [];
      if (additionalDetailsFromRoute.length > 0) {
        setAdditionalDetails(prevDetails => {
  
          const uniqueDetails = [...new Set([...prevDetails, ...additionalDetailsFromRoute])];
          return uniqueDetails;
        });
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const handleInputChange = (title, value) => {
    setDetailValues((prev) => ({
      ...prev,
      [title]: value,
    }));
  };
  
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

  const toggleDeleteMode = () => {

    Animated.timing(xIconRotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start(() => {
        xIconRotation.setValue(0);
    });

    const newDeleteMode = !deleteMode;
    setDeleteMode(newDeleteMode); 

    if (additionalDetails.length === 0) {
        setShowNoDetailsMessage(true);
        setTimeout(() => {
            setShowNoDetailsMessage(false);
            setDeleteMode(false); 
        }, 3000);
    } else {
       
        setDeleteMode(newDeleteMode); 
    }
  };

  const handleDeleteOption = (index) => {
    const updatedDetails = additionalDetails.filter((_, i) => i !== index);
    setAdditionalDetails(updatedDetails);

    if (updatedDetails.length === 0) {
      setShowNoDetailsMessage(false); 
      setDeleteMode(false); 
    }
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= MAX_LENGTH) {
      setProductDescription(text);
    }
  };

  const handleDeletePost = () => {
    setIsDeleteConfirmationVisible(true);
  };

  const confirmDeletePost = () => {
    setIsDeleteConfirmationVisible(false);
    setImages([]);
    setProductName('');
    setProductPrice('');
    setProductLocation('');
    setProductDescription('');
    setAdditionalDetails([]);
    setFocusedName(false);
    setFocusedPrice(false);
    setFocusedLocation(false);
    setFocusedDescription(false);;
  };

  const handleAddNewPost = () => {
    setIsAddPostConfirmationVisible(true);
  };

  const confirmAddNewPost = () => {
    setIsAddPostConfirmationVisible(false);
    setImages([]);
    setProductName('');
    setProductPrice('');
    setProductLocation('');
    setProductDescription('');
    setAdditionalDetails([]);
    setFocusedName(false);
    setFocusedPrice(false);
    setFocusedLocation(false);
    setFocusedDescription(false);
  };

  const handleContentSizeChange = (contentSize) => {
    const { height } = contentSize;

    if (height <= INPUT_HEIGHT) {
      setInputHeight(height);
    } else {
      setInputHeight(INPUT_HEIGHT); 
    }
  };

  const handleDeleteMediaItem = (index) => {
    setImages((prevImages) => prevImages.filter((item, i) => i !== index));
  };

  const handleDone = () => {
    if (images.length === 0 || productName.trim() === '' || productPrice.trim() === '' || productLocation.trim() === '' || productDescription.trim() === '') {
      setIsAlertVisible(true);
    } else {
      setIsConfirmationModalVisible(true); 
    }
  
  };

  const renderAlertMessage = () => {
    if (images.length === 0) {
      return 'Your Photo/Video is empty';
    } else if (productDescription.trim() === '') {
      return 'Your Name, Description, or Title is empty';
    } else if (productLocation.trim() === '') {
      return 'Your Location is empty';
    }
  };
  

  const handleConfirm = () => {
    setIsConfirmationModalVisible(false);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const updatedProduct = {
        id: productToEdit ? productToEdit.id : uuidv4(),
        images: images.map(image => image.uri),
        name: productName, 
        price: productPrice,
        location: productLocation,
        nameDescriptionTitle: productDescription,
      
      };
      navigation.navigate('Product', { updatedProduct, selectedOptions: additionalDetails });
    }, 3000);
  };

  const handleCancel = () => {
    setIsConfirmationModalVisible(false); 
  };

  const renderMediaList = () => {
    if (images.length === 0) {
      return (
        <View style={styles.mediaListContainer}>
          <TouchableOpacity style={styles.mediaListButton} onPress={handleOpenGallery}>
            <View style={styles.mediaListIconContainer}>
              <AntDesign name="camera" size={24} color="#2D8D2B" />
            </View>
            <Text style={styles.mediaListButtonText}>Add Photo/Video</Text>
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
        <Text style={styles.buttonTextImage}>Add Photo/Video</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButtonImage} onPress={handleOpenCamera}>
        <Text style={styles.buttonTextImage}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePressMediaItem = (item) => {
    if (item.type === 'video') {
        navigation.navigate('VideoPlayer', { uri: item.uri });
    } else if (item.type === 'image') {
        navigation.navigate('ImageViewer', { uri: item.uri });
    } else {
        console.warn('Unsupported document type:', item.fileType);
    }
};

  const handleOpenGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
        mediaTypes: ImagePicker.MediaTypeOptions.All,
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

  const xIconRotationInterpolate = xIconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <>
    {renderHeader()}
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <StatusBar hidden={false} />
        <View style={styles.productContainer}>
          <View style={styles.actionButtons}>
            <Text style={styles.sectionTitlePost}>Product Post</Text>
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
          <ScrollView contentContainerStyle={styles.mediaScrollContainer}>
            {renderMediaList()}
          </ScrollView>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to delete the selected images?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.inputContainer}>
        <Text style={styles.inputTitles}>Name, Description, or Title</Text>
        <View style={[styles.inputWrapper, focusedName && productName.length === 0 && styles.errorBorder]}>
          <TextInput
            style={styles.input}
            placeholder="Add Name, Description, or Title"
            value={productName}
            onChangeText={setProductName}
            onBlur={() => setFocusedName(true)}
          />
        </View>
        <Text style={styles.inputTitles}>Product Price</Text>
        <View style={[styles.inputWrapper, focusedProductPrice && productPrice.length === 0 && styles.errorBorder]}>
          <TextInput
            style={styles.input}
            placeholder="Add Product Price"
            value={productPrice}
            keyboardType="numeric"
            onChangeText={setProductPrice}
            onBlur={() => setFocusedPrice(true)}
          />
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
        <Text style={styles.inputTitles}>Description</Text>
        <View style={[styles.inputWrapperDescription, focusedDescription && productDescription.length === 0 && styles.errorBorder]}>
          <TextInput
            style={[styles.input, { height: inputHeight, textAlignVertical: 'top', padding: 15, marginHorizontal: 3, color: 'black' }]}
            placeholder="Add Description"
            value={productDescription}
            onChangeText={handleDescriptionChange}
            multiline
            onContentSizeChange={(contentSize) => handleContentSizeChange(contentSize)}
            scrollEnabled={false} 
            onBlur={() => setFocusedDescription(true)}
          />
          <Text style={[styles.characterCount, focusedDescription && productDescription.length === 0 && styles.errorCharacterCount]}>
            {`${productDescription.length}/${MAX_LENGTH}`}
          </Text>
        </View>
        <View style={styles.additionalDetailsContainer}>
          <Text style={styles.additionalDetailsText}>Additional Details</Text>
          <TouchableOpacity style={styles.additionalButton} onPress={() => setShowInfoMessageAdditional((prev) => !prev)}>
            <AntDesign 
              name="questioncircleo" 
              size={12} 
              color="black" 
              style={styles.iconSpacingAdditional} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.additionalButton} onPress={() => navigation.navigate('AdditionalDetails', { selectedOptions: additionalDetails })}>
            <MaterialCommunityIcons name="plus-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.additionalButton} onPress={toggleDeleteMode}>
            <Animated.View style={{ transform: [{ rotate: xIconRotationInterpolate }] }}>
              <Feather name={deleteMode ? 'x-circle' : 'minus-circle'} size={22} color="black" />
            </Animated.View>
          </TouchableOpacity>

          {showInfoMessageAdditional && (
          <View style={styles.infoMessageAdditional}>
            <Text style={styles.infoTextAdditional}>
              This section allows you to provide additional details about your product. 
              You can include information such as:
            </Text>
            <Text style={styles.bulletPoint}>{`\u2022`} Where the product was made?</Text>
            <Text style={styles.bulletPoint}>{`\u2022`} When it was made or harvested?</Text>
            <Text style={styles.bulletPoint}>{`\u2022`} How it was produced or manufactured?</Text>
            <Text style={styles.bulletPoint}>{`\u2022`} Who made or harvested the product?</Text>
            <Text style={styles.bulletPoint}>{`\u2022`} Any special process or unique characteristics.</Text>
            <Text style={styles.bulletPoint}>{`\u2022`} And other specifics you want to include.</Text>
          </View>
        )}
        </View>

        {additionalDetails.map((detail, index) => (
          <View key={index}>
            <Text style={styles.inputTitles}>{detail}</Text>
            <View style={[styles.inputWrapper, focusedDetails[detail] && detailValues[detail]?.length === 0 && styles.errorBorder]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={`Add ${detail}`}
                value={detailValues[detail]}
                onChangeText={(text) => handleInputChange(detail, text)}
                onBlur={() => setFocusedDetails(prev => ({ ...prev, [detail]: true }))}
              />
              {deleteMode && (
                <TouchableOpacity style={styles.deleteDetailButton} onPress={() => handleDeleteOption(index)}>
                  <AntDesign name="delete" size={20} color="#FF0000" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {showNoDetailsMessage && (
          <Text style={styles.noDetailsMessage}>
            You have no details added. You can click the plus sign to add details.
          </Text>
        )}

        <View style={styles.footerButtons}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
            <Feather name="arrow-right" size={30} color="#28B805" />
          </TouchableOpacity>
        </View>

      </View>

        <CustomAlert 
          visible={isAlertVisible} 
          title="Empty Input" 
          message={renderAlertMessage()} 
          onClose={() => setIsAlertVisible(false)} 
        />

        {/* Confirmation Modal */}
        <Modal visible={isConfirmationModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Are you sure you want to {productToEdit ? 'update' : 'post'} your product?</Text>
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

        {/* Loading Modal */}
        <Modal visible={isLoading} transparent={true} animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
                <ActivityIndicator size={50} color="#4CAF50" />
              <Text style={{ marginTop: 10, fontFamily: 'Poppins-Medium', color: 'white' }}>Uploading Photo/Video...</Text>
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

      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  scrollContainer: {
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
  infoTextAddtional: {
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
    width: '100%',
    height: height * 0.25,
    borderRadius: 5,
    padding: 10,
    elevation: 3, 
    zIndex: 10,
  },
  infoTextAdditional: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginBottom: 5,
    color: '#333',
  },
  bulletPoint: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 2,
    color: '#333',
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
  },
  deleteDetailButton: {
    marginLeft: 10, 
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
  additionalDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  additionalDetailsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginRight: 5, 
  },
  iconSpacingAdditional: {
    marginLeft: -5,
  },
  additionalButton: {
    padding: 5,
  },
  doneButton: {
    flexDirection: 'row',
    padding: 5,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  mediaName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  mediaInfo: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginLeft: 10,
  },
  mediaFileName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginLeft: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
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
  noDetailsMessage: {
    fontFamily: 'Poppins-Regular',
    color: '#F44336',
    marginTop: 10,
    textAlign: 'center',
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
  modalTitle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  modalButtonTextNo: {
    fontSize: 14,
    color: '#F44336',
    fontFamily: 'Poppins-Medium',
  },
});
