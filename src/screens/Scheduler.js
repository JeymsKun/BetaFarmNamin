import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import CustomAlert from '../components/CustomAlert';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const MAX_LENGTH = 100;

export default function Post({ navigation }) {
    const [productLocation, setProductLocation] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [showInfoMessageAdditional, setShowInfoMessageAdditional] = useState(false);
    const [images, setImages] = useState([]);
    const [focusedDescription, setFocusedDescription] = useState(false);
    const [additionalDetails, setAdditionalDetails] = useState([]);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
    const [isAddPostConfirmationVisible, setIsAddPostConfirmationVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);


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
        navigation.navigate('Product', {
            post: {
            images: images.map(image => image.uri),
            nameDescriptionTitle: productDescription,
            location: productLocation,
            },
        });
        }, 3000); 
    };
    

    const handleCancel = () => {
        setIsConfirmationModalVisible(false); 
    };

    const renderAlertMessage = () => {
        if (productDescription.trim() === '') {
            return 'Your Name, Description, or Title is empty';
        } else {
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

    const handleSelectDate = () => {
      setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        setSelectedDate(`${formattedDate}`);
      }
    };

    const handleSelectTime = () => {
      setShowTimePicker(true); 
  };
  
  const onTimeChange = (event, selectedTime) => {
      setShowTimePicker(false);
      if (selectedTime) {
          const formattedTime = selectedTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
          });
          setSelectedTime(formattedTime);
      }
  };
    

  
  return (
    <>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <StatusBar hidden={false} />

        <View style={styles.productContainer}>
            <Text style={styles.sectionTitlePost}>Create Schedule</Text>

            <View style={styles.wrapperButtons}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddNewPost}>
                    <View style={styles.iconTextRow}>
                        <AntDesign name="pluscircleo" size={20} color="black" />
                        <Text style={styles.buttonText}>Add New Schedule</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePost}>
                    <View style={styles.iconTextRow}>
                        <AntDesign name="delete" size={20} color="black" />
                        <Text style={styles.buttonText}>Delete Schedule</Text>
                    </View>
                </TouchableOpacity>
            </View>

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

        <View style={styles.dateTimeContainer}>
          <View style={styles.wrapper}>
            <Text style={styles.inputTitles}>Set a Date</Text>

            {/* Display selected date if available */}
            <View style={styles.selectorContainer}> 
              {selectedDate ? (  <Text style={styles.selectedDateTimeText}>{selectedDate}</Text> ) : null}
            </View>
            
            <TouchableOpacity style={styles.dateTimePickerButton} onPress={handleSelectDate}>
                <Text style={styles.pickerButtonText}>Select Date</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date" 
              display="calendar"
              onChange={onDateChange}
            />
          )}
          <View style={styles.wrapper}>
              <Text style={styles.inputTitles}>Set a Time</Text>

                {/* Display selected time if available */}
                <View style={styles.selectorContainer}>
                  {selectedTime ? (  <Text style={styles.selectedDateTimeText}>{selectedTime}</Text>  ) : null}
                </View>
            

                <TouchableOpacity style={styles.dateTimePickerButton} onPress={handleSelectTime}>
                    <Text style={styles.pickerButtonText}>Select Time</Text>
                </TouchableOpacity>
          </View>

          {/* Time Picker Modal */}
            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"  
                    display="spinner"
                    onChange={onTimeChange}
                />
            )}
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
            <Text style={styles.modalTitle}>Are you sure you want to post this?</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 10,
    color: '#333',
    fontSize: 10,
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
  productContainer: {
    marginTop: 50,
  },
  sectionTitlePost: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  wrapperButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    paddingVertical: 10,
    borderRadius: 5,
  },
  deleteButton: {
    paddingVertical: 10,
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
  inputTitles: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  characterCount: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'right',
    padding: 5, 
    color: 'gray',
    marginTop: 5,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
},
wrapper: {
    flex: 1,
    margin: 10,
},
inputTitles: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
},
selectorContainer: {
  width: '100%',
  height: 50,
  borderWidth: 1,
  borderColor: 'black',
  borderRadius: 10,
  padding: 15,
  marginBottom: 20,
  alignItems: 'center',
},
selectedDateTimeText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: 'black',
  
},
dateTimePickerButton: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
},
pickerButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
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
  
});
