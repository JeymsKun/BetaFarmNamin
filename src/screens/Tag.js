import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import { BackHandler } from 'react-native';
import { format } from 'date-fns';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import CustomAlert from '../components/CustomAlert';
import { v4 as uuidv4 } from 'uuid';
import { useSchedules } from '../context/ScheduleContext';

const { width, height } = Dimensions.get('window');

const MAX_LENGTH = 50;

export default function Tag({ navigation, route }) {
    // const { balanceToEdit } = route.params || {};
    // const [description, setDescription] = useState(balanceToEdit ? balanceToEdit.description : '');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('');
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [amountFocused, setAmountFocused] = useState(false);
    const [typeFocused, setTypeFocused] = useState(false);
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [balanceDeleteConfirmationVisible, setBalanceDeleteConfirmationVisible] = useState(false);
    const [balanceConfirmationVisible, setBalanceConfirmationVisible] = useState(false);
    // const { balance, setBalance } = useSchedules();
    // const [isUpdate, setIsUpdate] = useState(!!balanceToEdit);  
    const [isUpdate, setIsUpdate] = useState(null);

    useEffect(() => {
      const backAction = () => {
          navigation.navigate('Finance'); 
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
            setDescription(text);
        }
    };
    
    const handleConfirm = () => {
      setIsConfirmationModalVisible(false);
      setIsLoading(true);
    
      setTimeout(() => {
        setIsLoading(false);

        const updatedBalance = {
          id: isUpdate ? balanceToEdit.id : uuidv4(), 
          amount: amount,
          description: description,
          type: type,

        };

        if (isUpdate) {
          setSchedules((prevBalance) => 
            prevBalance.map((balance) =>
                balance.id === balanceToEdit.id ? updatedBalance : balance
            )
          );
        } else {

          setSchedules((prevBalance) => [...prevBalance, updatedBalance]);
        }
    
        navigation.navigate('Finance');
      }, 3000);
    };
    
    const handleCancel = () => {
        setIsConfirmationModalVisible(false); 
    };

    const handleDone = () => {
        if (amount.trim() === '' || description.trim() === '' || type.trim() === '') {
          setIsAlertVisible(true);    
        } else {
          setIsConfirmationModalVisible(true);  
        }
    };
  
    const renderAlertMessage = () => {
        if (amount.trim() === '') {
          return 'Your Amount is empty.';
        } else if (description.trim() === '') {
          return 'Your description is empty.';
        } else if (type.trim() === '') {
          return 'Your type is empty.';
        } else {
          return 'Your amount, description, type are empty';
        }
    };   

    const handleDeleteBalance = () => {
        setBalanceDeleteConfirmationVisible(true);
    };

    const confirmDeleteBalance = () => {
        setBalanceDeleteConfirmationVisible(false);
        setAmount('');
        setDescription('');
        setType('');
        setAmountFocused(false);
        setDescriptionFocused(false);
        setTypeFocused(false);
    };

    const handleAddNewBalance = () => {
        setBalanceConfirmationVisible(true);
    };

    const confirmAddNewBalance = () => {
        setBalanceConfirmationVisible(false);
        // setIsUpdate(false);
        setAmount('');
        setDescription('');
        setType('');
        setAmountFocused(false);
        setDescriptionFocused(false);
        setTypeFocused(false);
    };
  
  return (
    <>
        {renderHeader()}
        <ScrollView style={styles.container}>
            <StatusBar hidden={false} />

            <View style={styles.balanceContainer}>
            <Text style={styles.sectionTitle}>Create Tag</Text>

            <View style={styles.wrapperButtons}>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteBalance}>
                    <View style={styles.iconTextRow}>
                        <AntDesign name="delete" size={20} color="black" />
                        <Text style={styles.buttonText}>Delete Balance</Text>
                    </View>
                </TouchableOpacity>
            </View>

            </View>

            <View style={styles.placeholderBalanceContainer}>
                <View style={styles.placeholderBalance}>

                </View>

            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputTitles}>Name, Description, or Title</Text>
                <View style={[styles.inputWrapperDescription, descriptionFocused && description.length === 0 && styles.errorBorder]}>
                    <TextInput
                        style={styles.inputDescription}
                        placeholder="Add Name, Description, or Title"
                        value={description}
                        onChangeText={handleDescriptionChange}
                        multiline
                        scrollEnabled={false} 
                        onBlur={() => setDescriptionFocused(true)}
                    />
                    <Text style={[styles.characterCount, descriptionFocused && description.length === 0 && styles.errorCharacterCount]}>
                        {`${description.length}/${MAX_LENGTH}`}
                    </Text>
                </View>
                <Text style={styles.inputTitles}>Amount</Text>
                <View style={[styles.inputWrapper, amountFocused && amount.length === 0 && styles.errorBorder]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add Amount"
                        value={amount}
                        keyboardType="numeric"
                        onChangeText={setAmount}
                        onBlur={() => setAmountFocused(true)}
                    />
                </View>

                <View style={styles.tagWrapper}>
                    <TouchableOpacity style={styles.tagButton}>
                        <Text style={styles.tagText}>Add Tag</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.anotherTagWrapper}>
                    <TouchableOpacity style={styles.anotherTagButton}>
                        <Text style={styles.anotherTagText}>Add Another Tag</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Done Button at the bottom */}
            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneText}>Done</Text>
                <Feather name="arrow-right" size={30} color="#28B805" />
                </TouchableOpacity>
            </View>

        </ScrollView>


        {/* Confirmation Modal */}
        <Modal visible={isConfirmationModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Are you sure you want to {isUpdate ? 'update' : 'create'} this overview balance?</Text>
                    <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton}>
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
            title={'Empty'}
            message={renderAlertMessage()}
            onClose={() => setIsAlertVisible(false)}
        />

        {/* Loading Modal */}
        <Modal visible={isLoading} transparent={true} animationType="fade">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
                    <ActivityIndicator size={50} color="#4CAF50" />
                    <Text style={{ marginTop: 10, fontFamily: 'Poppins-Medium', color: 'white' }}>{isUpdate ? 'Updating your overview balance...' : 'Calculating your overview balance...'}</Text>
                </View>
            </View>
        </Modal>

        {/* Add New Balance Confirmation Modal */}
        <Modal visible={balanceConfirmationVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Are you sure you want to add a new balance?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalButton} onPress={confirmAddNewBalance}>
                            <Text style={styles.modalButtonTextYes}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setBalanceConfirmationVisible(false)}>
                            <Text style={styles.modalButtonTextNo}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Delete Balance Confirmation Modal */}
        <Modal visible={balanceDeleteConfirmationVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Are you sure you want to delete all balance?</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteBalance}>
                        <Text style={styles.modalButtonTextYes}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setBalanceDeleteConfirmationVisible(false)}>
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
    balanceContainer: {
        marginTop: 50,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: 'black',
    },
    wrapperButtons: {
        alignItems: 'flex-end'
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
    placeholderBalanceContainer: {
        justifyContent: 'center',
    },
    placeholderBalance: {
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        marginBottom: 5,
        height: 'auto',
        minHeight: 150, 
    },
    inputContainer: {
        marginTop: 20,
    },
    characterCount: {
        fontFamily: 'Poppins-Regular',
        textAlign: 'right',
        padding: 5, 
        color: 'gray',
        marginTop: 5,
    },
    errorCharacterCount : {
        color: '#F44336',
    },
    inputTitles: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(27, 164, 15, 0.31)',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    inputWrapperDescription: {
        marginBottom: 20,
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
        marginHorizontal: 5,
        padding: 10,
        flex: 1, 
    },
    inputType: {
        color: 'black',
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        marginHorizontal: 5,
        padding: 10,
        flex: 1, 
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: '#F44336',
    },
    tagWrapper: {
        marginTop: 10,
    },
    tagButton: {
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        padding: 10,
    },
    tagText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    anotherTagWrapper: {
        marginTop: 20,
    },
    anotherTagButton: {
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        padding: 10,
    },
    anotherTagText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    doneButton: {
        flexDirection: 'row',
        padding: 5,
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
