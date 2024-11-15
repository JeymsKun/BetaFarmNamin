import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Linking, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { colors } from '../utils/colors';
import { fonts} from '../utils/fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp({ navigation, route }) {
    const { role } = route.params;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [usernameHint, setUsernameHint] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [showPasswordHint, setShowPasswordHint] = useState(false);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');

    const [usernameBorderColor, setUsernameBorderColor] = useState(colors.gray);
    const [emailBorderColor, setEmailBorderColor] = useState(colors.gray);
    const [phoneBorderColor, setPhoneBorderColor] = useState(colors.gray);
    const [passwordBorderColor, setPasswordBorderColor] = useState(colors.gray);
    const [confirmPasswordBorderColor, setConfirmPasswordBorderColor] = useState(colors.gray);

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

    const handleEmailChange = (text) => {
        setEmail(text);
        const isValidEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(text);
        setEmailBorderColor(isValidEmail ? colors.gray : colors.red);
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
    
    const handleSignUpSubmit = () => {
        setLoading(true);

        const isUsernameEmpty = !username.trim();
        const isEmailEmpty = !email.trim();
        const isPhoneNumberEmpty = !phoneNumber.trim();
        const isPasswordEmpty = !password.trim();
        const isConfirmPasswordEmpty = !confirmPassword.trim();
    
        let isValid = true;

        if (isUsernameEmpty) {
            setUsernameBorderColor(colors.red);
            isValid = false;
        } else {
            setUsernameBorderColor(colors.gray);
        }

        if (isEmailEmpty) {
            setEmailBorderColor(colors.red);
            isValid = false;
        } else {
            setEmailBorderColor(colors.gray);
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
    
    
        if (!isUsernameEmpty && !isPhoneNumberEmpty && !isPasswordEmpty && !isConfirmPasswordEmpty && !agree) {
 
            setLoading(false);
            setModalMessage('You must agree to the terms and conditions and privacy policies.');
            setModalType('error');
            setModalVisible(true);

            setTimeout(() => {
                setUsername('');
                setPhoneNumber('');
                setPassword('');
                setConfirmPassword('');
                setAgree(false);
                setUsernameBorderColor(colors.gray);
                setPhoneBorderColor(colors.gray);
                setPasswordBorderColor(colors.gray);
                setConfirmPasswordBorderColor(colors.gray);
            }, 3000);

        } else if (isValid) {
            const formattedPhoneNumber = `0${phoneNumber}`;
            
            console.log('Username:', username);
            console.log('Email:', email); 
            console.log('Phone Number:', formattedPhoneNumber);
            console.log('Password:', password);
            console.log('Confirm Password:', confirmPassword);

            InsertRecord(formattedPhoneNumber);
        } else {

            setLoading(false);
            setModalMessage('Please fill in all required fields.');
            setModalType('error');
            setModalVisible(true);

 
            setTimeout(() => {
                setUsernameBorderColor(colors.gray);
                setPhoneBorderColor(colors.gray);
                setPasswordBorderColor(colors.gray);
                setConfirmPasswordBorderColor(colors.gray);
            }, 2000);
        }
    };
    

    const InsertRecord = (formattedPhoneNumber) => {
        setLoading(true);
    
        const InsertAPIURL = "http://192.168.1.56/farmnamin/signup.php";  
        const headers = {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
        };
    
        const data = {
            username,
            email, 
            phoneNumber: formattedPhoneNumber,
            password,
            confirmPassword,
            agree: agree ? 'yes' : 'no', 
            role
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
                        navigation.navigate('Information', { role }); 
                    }, 2000);
                } else if (responseData[0].Message === "Username, email, or phone number already exists.") {
                    setModalMessage("Username, email, or phone number already exists.");
                    setModalType('error');
                    setModalVisible(true);
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
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Sign Up</Text>
            <View style={[styles.inputContainer, { borderColor: usernameBorderColor }]}>
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
            <View style={[styles.inputContainer, { borderColor: emailBorderColor }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={handleEmailChange}
                />
            </View>
            <View style={[styles.inputContainer, { borderColor: phoneBorderColor }]}>
                <Text style={styles.phonePrefix}>+63</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    keyboardType="phone-pad"
                />
            </View>
            <View style={[styles.inputContainer, { borderColor: passwordBorderColor }]}>
                <TextInput
                    style={styles.input}
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
            <View style={[styles.inputContainer, { borderColor: confirmPasswordBorderColor }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color={colors.gray} />
                </TouchableOpacity>
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
                    <ActivityIndicator size={30} color={colors.blue} />
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.Bold,
        textAlign: 'center',
        marginBottom: 8,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        fontFamily: fonts.Regular,
        color: colors.black,
    },
    usernameHint: {
        fontSize: 12,
        color: colors.red,
        marginTop: 4,
    },
    passwordHint: {
        fontSize: 12,
        color: colors.red,
        marginTop: 4,
    },
    phonePrefix: {
        paddingLeft: 12,
        paddingRight: 8,
        fontSize: 16,
        color: colors.gray,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    checkbox: {
        fontSize: 24,
        marginRight: 8,
    },
    label: {
        fontSize: 14,
        color: colors.black,
        fontFamily: 'Poppins-Regular',
    },
    link: {
        fontSize: 11,
        color: colors.blue,
        fontFamily: 'Poppins-Regular',
        textDecorationLine: 'none',
    },
    signUpButtonContainer: {
        width: '100%',
        marginTop: 24,
    },
    signUpButton: {
        backgroundColor: 'green',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    signUpButtonText: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.Bold,
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