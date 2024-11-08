import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Linking, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';
import { fonts} from '../utils/fonts';
import CustomHeader from '../components/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SignUp({ navigation }) {
    const [username, setUsername] = useState('');
    const [usernameHint, setUsernameHint] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [showPasswordHint, setShowPasswordHint] = useState(false);
    const [userType, setUserType] = useState('');
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');

    const [usernameBorderColor, setUsernameBorderColor] = useState(colors.gray);
    const [phoneBorderColor, setPhoneBorderColor] = useState(colors.gray);
    const [passwordBorderColor, setPasswordBorderColor] = useState(colors.gray);
    const [confirmPasswordBorderColor, setConfirmPasswordBorderColor] = useState(colors.gray);
    const [userTypeBorderColor, setUserTypeBorderColor] = useState(colors.gray); 
    const [FirstNameBorderColor, setFirstNameBorderColor] = useState(colors.gray);
    const [LastNameBorderColor, setLastNameBorderColor] = useState(colors.gray);
    const [MiddleNameBorderColor, setMiddleNameBorderColor] =  useState(colors.gray);
    const [SuffixBorderColor, setSuffixBorderColor] = useState(colors.gray);
    const [birthdateBorderColor, setBirthdateBorderColor] = useState(colors.gray);
    const [birthdateTextColor, setBirthdateTextColor] = useState(colors.gray);

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [MiddleName, setMiddleName] = useState('');
    const [Suffix, setSuffix] = useState('');
    const [birthdate, setBirthdate] = useState('');

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const handleUsernameChange = (text) => {
        setUsername(text);
        const isPhoneNumber = /^\d+$/.test(text.replace('+63','')) || text.startsWith('09') || text.startsWith('+63');
        const isValidPhoneNumber = isPhoneNumber && (text.startsWith('09') ? text.length === 11 : text.length === 13);
        const isValidUsername = /^[a-zA-Z0-9]*$/.test(text);

        const borderColor = isPhoneNumber 
            ? (isValidPhoneNumber ? colors.gray : colors.red)
            : (isValidUsername ? colors.gray : colors.red);
        
        setUsernameBorderColor(borderColor);

        if (text.length > 20) {
            setUsernameBorderColor(colors.red);
            setUsernameHint('Username must be 20 characters or less.');
        } else {
            setUsernameHint('');
        }
    };

    const handlePhoneNumberChange = (text) => {
        setPhoneNumber(text);
        const isValid = /^[0-9]{10}$/.test(text);
        setPhoneBorderColor(isValid ? colors.gray : colors.red);
    };

    const validatePassword = (text) => {
        const isValidLength = text.length >= 12;
        const hasNoSpaces = !/\s/.test(text);
        const isAlphanumeric = /^[a-zA-Z0-9]*$/.test(text);
        return isValidLength && hasNoSpaces && isAlphanumeric;
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        const isValidLength = text.length >= 12;
        const isValid = validatePassword(text);
        setShowPasswordHint(!isValidLength);
        setPasswordBorderColor(isValid ? colors.gray : colors.red);
        setConfirmPasswordBorderColor(text === confirmPassword ? colors.gray : colors.red);
    };

    const handlePasswordBlur = () => {
        setPasswordBorderColor(colors.gray);
        setShowPasswordHint(false);
    };
    

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setConfirmPasswordBorderColor(text === password ? colors.gray : colors.red);
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
  
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; 
        return date.toLocaleDateString(undefined, options); 
    };

    const onChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || date;
            setShowPicker(false); 
            setDate(currentDate);
            
            const formattedDate = formatDate(currentDate); 
            setBirthdate(formattedDate);
            
            setBirthdateBorderColor(colors.gray);
            setBirthdateTextColor(colors.black);
        } else {
            setShowPicker(false); 
        }
    };

    const handlePress = () => {
        setShowPicker(true); 

        if (!birthdate) {
            setBirthdateBorderColor(colors.red);
            setBirthdateTextColor(colors.red);

        } else {
            setBirthdateBorderColor(colors.gray);
            setBirthdateTextColor(colors.black);
        }
    };

    
    const handleSignUpSubmit = () => {
        setLoading(true);

        const birthdateParts = birthdate.split(' ');
        const BirthMonth = birthdateParts[0];  
        const BirthDay = birthdateParts[1].replace(',', ''); 
        const BirthYear = birthdateParts[2];  

        const isFirstNameEmpty = !FirstName.trim();
        const isLastNameEmpty = !LastName.trim();
        const isMiddleNameEmpty = !MiddleName.trim();
        const isSuffixEmpty = !Suffix.trim();
        const isBirthdateEmpty = !birthdate.trim();
        const isUsernameEmpty = !username.trim();
        const isPhoneNumberEmpty = !phoneNumber.trim();
        const isPasswordEmpty = !password.trim();
        const isConfirmPasswordEmpty = !confirmPassword.trim();
        const isUserTypeEmpty = !userType;
    
        let isValid = true;

        if (isFirstNameEmpty) {
            setFirstNameBorderColor(colors.red);
            isValid = false;
        } else {
            setFirstNameBorderColor(colors.gray);
        }

        if (isLastNameEmpty) {
            setLastNameBorderColor(colors.red);
        } else {
            setLastNameBorderColor(colors.gray);
        }

        if (isMiddleNameEmpty) {
            setMiddleNameBorderColor(colors.red);
        } else {
            setMiddleNameBorderColor(colors.gray);
        }

        if (isSuffixEmpty) {
            setSuffixBorderColor(colors.red);
        } else {
            setSuffixBorderColor(colors.gray);
        }

        if (isBirthdateEmpty) {
            setBirthdateBorderColor(colors.red);
            isValid = false; 
        } else {
            setBirthdateBorderColor(colors.gray);
        }
    
        if (isUsernameEmpty) {
            setUsernameBorderColor(colors.red);
            isValid = false;
        } else {
            setUsernameBorderColor(colors.gray);
        }
    
        if (isPhoneNumberEmpty) {
            setPhoneBorderColor(colors.red);
            isValid = false;
        } else {
            setPhoneBorderColor(colors.gray);
        }
    
        if (isPasswordEmpty) {
            setPasswordBorderColor(colors.red);
            isValid = false;
        } else {
            setPasswordBorderColor(colors.gray);
        }
    
        if (isConfirmPasswordEmpty) {
            setConfirmPasswordBorderColor(colors.red);
            isValid = false;
        } else {
            setConfirmPasswordBorderColor(colors.gray);
        }
    
        if (isUserTypeEmpty) {
            setUserTypeBorderColor(colors.red);
            isValid = false;
        } else {
            setUserTypeBorderColor(colors.gray);
        }
    
        if (!agree && !isFirstNameEmpty && !isLastNameEmpty && !isMiddleNameEmpty && !isSuffixEmpty && !isBirthdateEmpty && !isUsernameEmpty && !isPhoneNumberEmpty && !isPasswordEmpty && !isConfirmPasswordEmpty && !isUserTypeEmpty) {
 
            setLoading(false);
            setModalMessage('You must agree to the terms and conditions and privacy policies.');
            setModalType('error');
            setModalVisible(true);

            setTimeout(() => {
                setFirstName('');
                setLastName('');
                setMiddleName('');
                setSuffix('');
                setBirthdate('');
                setUsername('');
                setPhoneNumber('');
                setPassword('');
                setConfirmPassword('');
                setUserType('');
                setAgree(false);
                setFirstNameBorderColor(colors.gray);
                setLastNameBorderColor(colors.gray);
                setMiddleNameBorderColor(colors.gray);
                setSuffixBorderColor(colors.gray);
                setBirthdateBorderColor(colors.gray);
                setUsernameBorderColor(colors.gray);
                setPhoneBorderColor(colors.gray);
                setPasswordBorderColor(colors.gray);
                setConfirmPasswordBorderColor(colors.gray);
                setUserTypeBorderColor(colors.gray);
            }, 3000);

        } else if (isValid) {
            const formattedPhoneNumber = `0${phoneNumber}`;
            
            console.log('First Name: ', FirstName);
            console.log('Last Name: ', LastName);
            console.log('Middle Name: ', MiddleName + ' ' + 'Suffix: ', Suffix);
            console.log('Birthdate: ', birthdate);
            console.log('Username:', username);
            console.log('Phone Number:', formattedPhoneNumber);
            console.log('Password:', password);
            console.log('Confirm Password:', confirmPassword);
            console.log('User Type:', userType);

            InsertRecord(formattedPhoneNumber, BirthMonth, BirthDay, BirthYear);
        } else {

            setLoading(false);
            setModalMessage('Please fill in all required fields.');
            setModalType('error');
            setModalVisible(true);

 
            setTimeout(() => {
                setFirstNameBorderColor(colors.gray);
                setLastNameBorderColor(colors.gray);
                setMiddleNameBorderColor(colors.gray);
                setSuffixBorderColor(colors.gray);
                setBirthdateBorderColor(colors.gray);
                setUsernameBorderColor(colors.gray);
                setPhoneBorderColor(colors.gray);
                setPasswordBorderColor(colors.gray);
                setConfirmPasswordBorderColor(colors.gray);
                setUserTypeBorderColor(colors.gray);
            }, 2000);
        }
    };
    

    const InsertRecord = (formattedPhoneNumber, BirthMonth, BirthDay, BirthYear) => {
        setLoading(true);
    
        const InsertAPIURL = "http://192.168.1.56/farmnamin/signup.php";  
        const headers = {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
        };
    
        const currentYear = new Date().getFullYear();
        const calculatedAge = currentYear - parseInt(BirthYear);
    
        const data = {
            username,
            mobileNumber: formattedPhoneNumber,
            password,
            confirmPassword,
            userType,
            agree: agree ? 'yes' : 'no',
            FirstName,
            LastName,
            MiddleName,
            Suffix,
            BirthMonth, 
            BirthDay,   
            BirthYear,  
            age: calculatedAge,
        };
        
    
        fetch(InsertAPIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(text => {
            console.log('Response Text:', text);
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('JSON Parse Error:', error);
                throw error;
            }
        })
        .then(responseData => {
            setLoading(false);
            if (Array.isArray(responseData) && responseData[0] && responseData[0].Message) {
                if (responseData[0].Message === "You have successfully signed up!") {
                    setModalMessage(responseData[0].Message);
                    setModalType('success');
                    setModalVisible(true);
                    setTimeout(() => {
                        navigation.navigate('Login');
                    }, 2000); 
                } else {
                    setModalMessage(responseData[0].Message);
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
        <View styles={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
            <CustomHeader navigation={navigation}/>
            <Text style={styles.title}>Sign Up</Text>
                <View style={[styles.usernameContainer, { borderColor: usernameBorderColor }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={handleUsernameChange}
                    />
                </View>
                {usernameHint && (
                        <Text style={styles.usernameHint}>
                            {usernameHint}
                        </Text>
                )}
                <View style={[styles.phoneContainer, { borderColor: phoneBorderColor }]}>
                    <Text style={styles.phonePrefix}>+63</Text>
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={handlePhoneNumberChange}
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={[styles.FirstNameContainer, { borderColor: FirstNameBorderColor }]}>
                    <TextInput
                        style={styles.FirstName}
                        placeholder="First Name"
                        value={FirstName}
                        onChangeText={handleFirstName}
                    />
                </View>
                <View style={[styles.LastNameContainer, { borderColor: LastNameBorderColor }]}>
                    <TextInput
                        style={styles.LastName}
                        placeholder="Last Name"
                        value={LastName}
                        onChangeText={handleLastName}
                    />
                </View>
                <View style={[styles.middleContainer, { borderColor: MiddleNameBorderColor }]}>
                    <View style={[styles.MiddleNameContainer, { borderColor: MiddleNameBorderColor }]}>
                        <TextInput
                            style={styles.MiddleName}
                            placeholder="Middle Name"
                            value={MiddleName}
                            onChangeText={handleMiddleName}
                        />
                    </View>
                    <View style={[styles.SuffixContainer, { borderColor: SuffixBorderColor }]}>
                        <TextInput
                            style={styles.Suffix}
                            placeholder="Suffix"
                            value={Suffix}
                            onChangeText={handleSuffix}
                        />
                    </View>
                </View>
                <View style={[styles.birthdateContainer, { borderColor: birthdateBorderColor }]}>
                    <Text style={styles.birthdatePrefix}>Birthdate</Text>
                    <TouchableOpacity style={styles.dateWrapper} onPress={handlePress}>
                        <Text style={[styles.dateText, { color: birthdateTextColor }]}>
                            {birthdate || "Select Month/Day/Year"}
                        </Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                            maximumDate={new Date()} 
                        />
                    )}
                </View>
                <View style={[styles.passwordContainer, { borderColor: passwordBorderColor }]}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        secureTextEntry={showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.gray} />
                    </TouchableOpacity>
                </View>
                {showPasswordHint && (
                    <Text style={styles.passwordHint}>
                        Password must be at least 12 characters long.
                    </Text>
                )}
                <View style={[styles.passwordContainer, { borderColor: confirmPasswordBorderColor }]}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={handleConfirmPasswordChange}
                        secureTextEntry={showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color={colors.gray} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.pickerContainer, { borderColor: userTypeBorderColor }]}>
                    <Picker
                        selectedValue={userType}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            setUserType(itemValue);
                            setUserTypeBorderColor(colors.gray);
                        }}
                    >
                        <Picker.Item label="Which account do you belong to?" value="" color={colors.gray} />
                        <Picker.Item label="Farmer" value="farmer" />
                        <Picker.Item label="Consumer" value="consumer" />
                    </Picker>
                </View>
                
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity onPress={() => setAgree(!agree)}>
                            <Text style={styles.checkbox}>{agree ? '☑' : '☐'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}>I agree to the </Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://your-terms-and-conditions-url.com')}>
                            <Text style={[styles.link, { color: agree ? colors.blue : colors.red }]}>Terms and Conditions</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}> and </Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>
                            <Text style={[styles.link, { color: agree ? colors.blue : colors.red }]}>Privacy Policy</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}>.</Text>
                    </View>
                    <View style={styles.signUpButtonContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.blue} />
                        ) : (
                            <TouchableOpacity
                                style={styles.signUpButton}
                                onPress={handleSignUpSubmit}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.signUpButtonText}>Sign Up</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <View style={styles.linkContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.signUpLink}>Already have an account? Log In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                
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
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    scrollContainer: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 80,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.Bold,
        marginBottom: 8,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 4,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    usernameHint: {
        width: '100%',
        color: colors.red,
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 20,
    },
    input: {
        width: '100%',
        padding: 8,
    },
    
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    phonePrefix: {
        padding: 8,
        fontSize: 16,
        color: colors.gray,
    },
    phoneInput: {
        flex: 1,
        padding: 8,
    },
    FirstNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    FirstName: {
        flex: 1,
        padding: 8,
    },
    LastNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    LastName: {
        flex: 1,
        padding: 8,
    },
    middleContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    MiddleNameContainer: {
        flexBasis: '75%',
        marginRight: 8, 
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    MiddleName: {
        width: '100%',
        padding: 8,
    },
    SuffixContainer: {
        flexBasis: '22%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    Suffix: {
        flex: 1,
        width: '100%',
        padding: 8,
    },
    birthdateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
        height: 50,
    },
    birthdatePrefix: {
        fontSize: 16,
        color: colors.gray,
        marginRight: 5,
        marginLeft: 6,
    },
    dateWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    dateText: {
        fontSize: 16,
        color: colors.gray,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    passwordInput: {
        flex: 1,
        padding: 8,
    },
    passwordHint: {
        width: '100%',
        color: colors.red,
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    picker: {
        flex: 1,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        marginTop: 14,
    },
    checkbox: {
        fontSize: 24,
        marginRight: 7,
        lineHeight: 30,
    },
    label: {
        fontSize: 16,
        lineHeight: 24,
    },
    link: {
        fontSize: 14,
        color: 'blue',
    },
    signUpLink: {
        marginTop: 7,
        color: 'blue',
    },
    signUpButtonContainer: {
        marginVertical: 4, 
        width: '100%',
    },
    signUpButton: {
        backgroundColor: 'green', 
        padding: 8,
        borderRadius: 8, 
        alignItems: 'center', 
    },
    signUpButtonText: {
        color: '#FFFFFF', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkContainer: {
        marginVertical: 3,
        marginTop: 5,
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