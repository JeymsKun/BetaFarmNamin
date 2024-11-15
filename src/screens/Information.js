import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Linking, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';
import { fonts} from '../utils/fonts';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Information({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');
    const [genderType, setGenderType] = useState('');
    const [genderTypeBorderColor, setGenderTypeBorderColor] = useState(colors.gray); 
    const [FirstNameBorderColor, setFirstNameBorderColor] = useState(colors.gray);
    const [LastNameBorderColor, setLastNameBorderColor] = useState(colors.gray);
    const [MiddleNameBorderColor, setMiddleNameBorderColor] =  useState(colors.gray);
    const [SuffixBorderColor, setSuffixBorderColor] = useState(colors.gray);
    const [birthdateBorderColor, setBirthdateBorderColor] = useState(colors.gray);
    const [AgeBorderColor, setAgeBorderColor] = useState(colors.gray);
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [MiddleName, setMiddleName] = useState('');
    const [Age, setAge] = useState('');
    const [Suffix, setSuffix] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(false);
        setDate(currentDate);
    
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();

        console.log("Selected Date: ", currentDate); 
    
        setBirthMonth(month);
        setBirthDay(day);
        setBirthYear(year);
    };

    const validateName = (text) => {
        const isValid = /^[A-Za-zñÑ\s-]*$/.test(text);
        return isValid;
    };    

    const handleFirstName = (text) => {
        setFirstName(text);
        const isValid = validateName(text);
        setFirstNameBorderColor(isValid ? colors.gray : colors.red);
    };
    
    const handleLastName = (text) => {
        setLastName(text);
        const isValid = validateName(text);
        setLastNameBorderColor(isValid ? colors.gray : colors.red);        
    };
    
    const handleMiddleName = (text) => {
        setMiddleName(text);
        const isValid = /^[a-zA-Z.]*$/.test(text); 
        setMiddleNameBorderColor(isValid ? colors.gray : colors.red);
    };
    
    const handleSuffix = (text) => {
        if (text.length > 8) {
            setSuffix(text.slice(0, 8)); 
            setSuffixBorderColor(colors.red);
        } else {
            setSuffix(text);
            const isValid = /^[a-zA-Z0-9\s|,&]*$/.test(text); 
            setSuffixBorderColor(isValid ? colors.gray : colors.red);
        }
    };

    const handleAge = (text) => {

        setAge(text);
        
        if (!isNaN(text) && text.trim() !== '') {
  
        }
    };

    const handleInformationSubmit = () => {
        setLoading(true);
    
        let isValid = true;
    
        if (!FirstName || !LastName || !birthMonth || !birthDay || !birthYear || !genderType) {
            isValid = false;
            setModalMessage('Please fill in all required fields.');
            setModalType('error');
            setModalVisible(true);
            setLoading(false);
            return;
        }
    
        const userData = {
            FirstName,
            LastName,
            MiddleName,
            Suffix,
            Age,
            gender: genderType,
            BirthMonth: birthMonth,  
            BirthDay: birthDay,      
            BirthYear: birthYear,   
        };
    
        fetch('http://192.168.1.56/farmnamin/information.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())  
        .then(responseData => {
            setLoading(false);
    
            if (responseData && responseData.Message) {
                if (responseData.Message === "Your information has been successfully updated!") {
                    setModalMessage(responseData.Message);
                    setModalType('success');
                    setModalVisible(true);
    
                    setTimeout(() => {
                        navigation.navigate('HomeTabs');
                    }, 2000); 
                } else {
                    setModalMessage(responseData.Message);
                    setModalType('error');
                    setModalVisible(true);
                }
            } else {
                setModalMessage("Unexpected response format.");
                setModalType('error');
                setModalVisible(true);
            }
        })
        .catch(error => {
            setLoading(false);
            setModalMessage("Error: " + error.message);
            setModalType('error');
            setModalVisible(true);
        });
    };
    
    const closeModal = () => {
        setModalVisible(false);
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Basic Information</Text>
            <Text style={styles.subTitle}>Please fill in your profile information.</Text>

                <Text style={styles.name}>First Name</Text>
                <View style={[styles.inputContainer, { borderColor: FirstNameBorderColor }]}>
                    <TextInput
                        style={styles.FirstName}
                        placeholder="First Name"
                        value={FirstName}
                        onChangeText={handleFirstName}
                    />
                </View>

                <Text style={styles.name}>Last Name</Text>
                <View style={[styles.inputContainer, { borderColor: LastNameBorderColor }]}>
                    <TextInput
                        style={styles.LastName}
                        placeholder="Last Name"
                        value={LastName}
                        onChangeText={handleLastName}
                    />
                </View>

                <Text style={styles.name}>Middle Name</Text>
                <View style={[styles.inputContainer, { borderColor: MiddleNameBorderColor }]}>
                    <TextInput
                        style={styles.MiddleName}
                        placeholder="Middle Name"
                        value={MiddleName}
                        onChangeText={handleMiddleName}
                    />
                </View>

                <Text style={styles.name}>Suffix</Text>
                <View style={[styles.inputContainer, { borderColor: SuffixBorderColor }]}>
                    <TextInput
                        style={styles.Suffix}
                        placeholder="Suffix"
                        value={Suffix}
                        onChangeText={handleSuffix}
                    />
                </View>

                <Text style={styles.name}>Age</Text>
                <View style={[styles.inputContainer, { borderColor: AgeBorderColor }]}>
                    <TextInput
                        style={styles.Suffix}
                        placeholder="Age"
                        value={Age}
                        onChangeText={handleAge}
                        keyboardType="numeric" 
                    />
                </View>

                <Text style={styles.name}>Please fill in a complete birthday</Text>
                <View style={[styles.birthdateContainer, { borderColor: birthdateBorderColor }]}>

                    {/* Month Display with Date Picker Trigger */}
                    <TouchableOpacity 
                        onPress={() => setShowPicker(true)} 
                        style={[styles.pickerSection, { borderColor: birthdateBorderColor }]}>
                        <Text style={styles.birthdateText}>{birthMonth || 'Month'}</Text>
                        <Ionicons name="calendar-outline" size={18} color={colors.gray} style={styles.icon} />
                    </TouchableOpacity>

                    {/* Day Display */}
                    <View style={[styles.pickerSection, { borderColor: birthdateBorderColor }]}>
                        <Text style={styles.birthdateText}>{birthDay || 'Day'}</Text>
                    </View>

                    {/* Year Display */}
                    <View style={[styles.pickerSection, { borderColor: birthdateBorderColor }]}>
                        <Text style={styles.birthdateText}>{birthYear || 'Year'}</Text>
                    </View>
                </View>


                {/* DateTimePicker for selecting birthdate */}
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                
                <Text style={styles.name}>Gender</Text>
                <View style={[styles.pickerContainer, { borderColor: genderTypeBorderColor }]}>
                    <Picker
                        selectedValue={genderType}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            setGenderType(itemValue);
                            setGenderTypeBorderColor(colors.gray);
                        }}
                    >
                        <Picker.Item label="Add Gender" value="" color={colors.gray} />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                </View>

                <View style={styles.footerButtons}>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={styles.proceedButton} onPress={handleInformationSubmit}>
                        <Text style={styles.proceedText}>Proceed</Text>
                        <Feather name="arrow-right" size={30} color="#28B805" />
                    </TouchableOpacity>
                </View>
                
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContainer, { borderColor: modalType === 'success' ? colors.green : colors.red }]}>
                            <Text style={[styles.modalMessage, { color: modalType === 'success' ? colors.green : colors.red }]}>
                                {modalMessage}
                            </Text>
                            <Button title="Close" onPress={closeModal} />
                        </View>
                    </View>
                </Modal>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.Bold,
    },
    subTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginBottom: 20,
    },
    name: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    inputContainer: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        padding: 5,
        height: 50,
        borderColor: colors.gray,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        color: colors.gray,
    },
    birthdateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    birthdateText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    pickerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%',
        height: 50,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        padding: 8,
        justifyContent: 'center',
        marginBottom: 10,
    },
    icon: {
        marginLeft: 4,
    },
    picker: {
        flex: 1,
    },
    proceedButton: {
        flexDirection: 'row',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
    },
    proceedText: {
        padding: 5,
        fontSize: 14,
        color: "#28B805",  
        fontFamily: 'Poppins-Bold',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 16,
    },
});