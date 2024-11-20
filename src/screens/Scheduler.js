import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import { BackHandler } from 'react-native';
import { format } from 'date-fns';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import CustomAlert from '../components/CustomAlert';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import { useSchedules } from '../context/ScheduleContext';

const { width, height } = Dimensions.get('window');

const MAX_LENGTH = 100;

export default function Scheduler({ navigation, route }) {
    const { scheduleToEdit } = route.params || {};
    const [productDescription, setProductDescription] = useState(scheduleToEdit ? scheduleToEdit.description : '');
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [focusedDescription, setFocusedDescription] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
    const [scheduleConfirmationVisible, setScheduleConfirmationVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(scheduleToEdit ? scheduleToEdit.date : null);
    const [isSettingStartTime, setIsSettingStartTime] = useState(true);
    const [selectedStartTime, setSelectedStartTime] = useState(
      scheduleToEdit && scheduleToEdit.time ? scheduleToEdit.time.split(' - ')[0] : null
    ); 
    const [selectedEndTime, setSelectedEndTime] = useState(
      scheduleToEdit && scheduleToEdit.time ? scheduleToEdit.time.split(' - ')[1] : null
    );
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isDateCanceled, setIsDateCanceled] = useState(false);
    const [isTimeCanceled, setIsTimeCanceled] = useState(false);
    const [isTimeError, setIsTimeError] = useState(false);
    const [isDateError, setIsDateError] = useState(false);
    const { schedules, setSchedules } = useSchedules();
    const [isUpdate, setIsUpdate] = useState(!!scheduleToEdit);  

    useEffect(() => {
      const backAction = () => {
          navigation.navigate('Calendar'); 
          return true; 
      };
  
      BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []); 
    
    useEffect(() => {
        const clearMessage = () => {
        setShowInfoMessage(false);
        };

        let timer;
        if (showInfoMessage) {
        timer = setTimeout(clearMessage, 4000); 
        }

        return () => clearTimeout(timer); 
    }, [showInfoMessage]);

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

    const handleDescriptionChange = (text) => {
        if (text.length <= MAX_LENGTH) {
        setProductDescription(text);
        }
    };

    const handleDone = () => {
      if (productDescription.trim() === '') {
        setIsAlertVisible(true);  
      } else if (!selectedDate) {
        setIsAlertVisible(true);  
      } else if (isDateError) {
        setIsAlertVisible(true); 
      } else if (isTimeError) {
        setIsAlertVisible(true);  
      } else {
        setIsConfirmationModalVisible(true);  
      }
    };

    const renderAlertMessage = () => {
      if (productDescription.trim() === '') {
        return 'Your Name, Description, or Title is empty';
      } else if (!selectedDate) {
        return 'Your Date is empty';
      } else if (isDateError) {
        return 'The selected date is in the past. Please select a future date.';
      } else if (isTimeError) {
        return 'The selected time is in the past. Please select a future time.';
      } else {
        return 'Your Name, Description, or Title and Date are empty';
      }
    };    
    
    const handleConfirm = () => {
      setIsConfirmationModalVisible(false);
      setIsLoading(true);
    
      setTimeout(() => {
        setIsLoading(false);

        const selectedTime = `${selectedStartTime || ''}${(selectedStartTime && selectedEndTime) ? ' - ' : ''}${selectedEndTime || ''}`;

        const updatedSchedule = {
          id: isUpdate ? scheduleToEdit.id : uuidv4(), 
          description: productDescription,
          date: selectedDate,
          time: selectedTime,
        };

        if (isUpdate) {
          setSchedules((prevSchedules) => 
            prevSchedules.map((schedule) =>
              schedule.id === scheduleToEdit.id ? updatedSchedule : schedule
            )
          );
        } else {

          setSchedules((prevSchedules) => [...prevSchedules, updatedSchedule]);
        }
    
        navigation.navigate('Calendar');
      }, 3000);
    };
    
    const handleCancel = () => {
        setIsConfirmationModalVisible(false); 
    };

    const handleDeleteSchedule = () => {
        setIsDeleteConfirmationVisible(true);
    };

    const confirmDeleteSchedule = () => {
        setIsDeleteConfirmationVisible(false);
        setProductDescription('');
        setSelectedDate(null);
        setSelectedStartTime(null); 
        setSelectedEndTime(null); 
        setIsDateCanceled(false);
        setIsTimeCanceled(false);
        setIsDateError(false);
        setIsTimeError(false);
    };

    const handleAddNewSchedule = () => {
      setScheduleConfirmationVisible(true);
    };

    const confirmAddNewSchedule = () => {
      setScheduleConfirmationVisible(false);
      setIsUpdate(false);
      setProductDescription('');
      setSelectedDate(null);     
      setSelectedStartTime(null); 
      setSelectedEndTime(null); 
      setIsDateCanceled(false);
      setIsTimeCanceled(false);
      setIsDateError(false);
      setIsTimeError(false);
    };

    const handleSelectDate = () => {
      setShowDatePicker(true);
      setIsDateCanceled(false);
    };

    const onDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      if (event.type === 'dismissed') {
        setIsDateCanceled(true); 
      } else if (selectedDate) {
        const today = new Date();
        const selectedDateObj = new Date(selectedDate);

        selectedDateObj.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDateObj < today) {
          setIsDateError(true);
        } else {
          setIsDateError(false); 
        }

        const formattedDate = selectedDateObj.toISOString().split('T')[0]; 
        setSelectedDate(formattedDate);

      }
    };
    

    const handleSelectTime = () => {
      setIsSettingStartTime(true);
      setShowTimePicker(true);
    };
  
    const onTimeChange = (event, selectedTime) => {
      if (event.type === 'dismissed') {
        setIsTimeCanceled(true);
        setShowTimePicker(false);
      } else if (selectedTime && selectedTime instanceof Date) {
        const currentTime = new Date();
        const formattedTime = selectedTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        if (selectedTime < currentTime) {
          setIsTimeError(true);  
          setShowTimePicker(false);  
        } else {
          setIsTimeError(false); 
        }
    
        if (isSettingStartTime) {
          setSelectedStartTime(formattedTime);
          setIsSettingStartTime(false);
        } else {
          setSelectedEndTime(formattedTime); 
          setShowTimePicker(false);
        }
        
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
              <TouchableOpacity style={styles.addButton} onPress={handleAddNewSchedule}>
                  <View style={styles.iconTextRow}>
                      <AntDesign name="pluscircleo" size={20} color="black" />
                      <Text style={styles.buttonText}>Add New Schedule</Text>
                  </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSchedule}>
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
            <View style={[styles.selectorContainer, 
              (isDateError || (isDateCanceled && !selectedDate)) && styles.errorBorder
            ]}> 
              {selectedDate ? (
                <Text style={styles.selectedDateTimeText}>
                  {format(new Date(selectedDate), 'MMMM dd, yyyy')}
                </Text>
              ) : null}
            </View>
            
            <TouchableOpacity style={styles.dateTimePickerButton} onPress={handleSelectDate}>
                <Text style={styles.pickerButtonText}>Select Date</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate ? new Date(selectedDate) : date} 
              mode="date" 
              display="calendar"
              onChange={onDateChange}
              minimumDate={new Date()}  
            />
          )}


          <View style={styles.wrapper}>
            <Text style={styles.inputTitles}>Select Time</Text>

            <View style={[styles.selectorContainer, 
              (isTimeError || (isTimeCanceled && !selectedStartTime && !selectedEndTime)) && styles.errorBorder
            ]}>
              {selectedStartTime && selectedEndTime ? (
                <Text style={styles.selectedDateTimeText}>
                  {selectedStartTime} - {selectedEndTime}
                </Text>
              ) : selectedStartTime && !selectedEndTime ? (
                <Text style={styles.timeWithNoEnd}>
                  {selectedStartTime} - N/A
                </Text>
              ) : (
                <Text style={styles.optionalTimeText}>
                  Optional
                </Text>
              )}
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
            <Text style={styles.modalTitle}>Are you sure you want to {isUpdate ? 'update' : 'create'} this schedule?</Text>
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
        title={
          isDateError && isTimeError
            ? 'Error: Passed Date and Time Detected'
            : isDateError
            ? 'Error: Passed Date Detected'
            : isTimeError
            ? 'Error: Passed Time Detected'
            : 'Empty Input'
        }
        message={renderAlertMessage()}
        onClose={() => setIsAlertVisible(false)}
      />

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <ActivityIndicator size={50} color="#4CAF50" />
            <Text style={{ marginTop: 10, fontFamily: 'Poppins-Medium', color: 'white' }}>{isUpdate ? 'Updating your schedule...' : 'Setting up your schedule...'}</Text>
          </View>
        </View>
      </Modal>

      {/* Add New Post Confirmation Modal */}
      <Modal visible={scheduleConfirmationVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to add a new schedule?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmAddNewSchedule}>
                <Text style={styles.modalButtonTextYes}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setScheduleConfirmationVisible(false)}>
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
            <Text style={styles.modalTitle}>Are you sure you want to delete all schedule?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteSchedule}>
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
  errorBorder: {
    borderWidth: 1,
    borderColor: '#F44336',
  },
  errorCharacterCount : {
    color: '#F44336',
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
  fontSize: 12,
  fontFamily: 'Poppins-Medium',
  color: 'black',
},
optionalTimeText: {
  fontSize: 12,
  fontFamily: 'Poppins-Medium',
  color: 'gray',
},
timeWithNoEnd: {
  fontSize: 12,
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
