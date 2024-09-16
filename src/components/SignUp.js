import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Linking, ActivityIndicator, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';
import CustomHeader from '../components/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setConfirmPasswordBorderColor(text === password ? colors.gray : colors.red);
    };

    const handleSignUpSubmit = () => {
        setLoading(true);
        const isUsernameEmpty = !username.trim();
        const isPhoneNumberEmpty = !phoneNumber.trim();
        const isPasswordEmpty = !password.trim();
        const isConfirmPasswordEmpty = !confirmPassword.trim();
        const isUserTypeEmpty = !userType;
    
        let isValid = true;
    
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
    
        if (!agree && !isUsernameEmpty && !isPhoneNumberEmpty && !isPasswordEmpty && !isConfirmPasswordEmpty && !isUserTypeEmpty) {
 
            setLoading(false);
            setModalMessage('You must agree to the terms and conditions and privacy policies.');
            setModalType('error');
            setModalVisible(true);

            setTimeout(() => {
                setUsername('');
                setPhoneNumber('');
                setPassword('');
                setConfirmPassword('');
                setUserType('');
                setAgree(false);
                setUsernameBorderColor(colors.gray);
                setPhoneBorderColor(colors.gray);
                setPasswordBorderColor(colors.gray);
                setConfirmPasswordBorderColor(colors.gray);
                setUserTypeBorderColor(colors.gray);
            }, 3000);

        } else if (isValid) {
            const formattedPhoneNumber = `0${phoneNumber}`;
    
            console.log('Username:', username);
            console.log('Phone Number:', formattedPhoneNumber);
            console.log('Password:', password);
            console.log('Confirm Password:', confirmPassword);
            console.log('User Type:', userType);
    
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
                setUserTypeBorderColor(colors.gray);
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
            mobileNumber: formattedPhoneNumber,
            password,
            confirmPassword,
            userType,
            agree: agree ? 'yes' : 'no',
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
                    }, 2000); // 2-second delay before navigating
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
            <CustomHeader navigation={navigation} />
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={[styles.input, { borderColor: usernameBorderColor }]}
                placeholder="Username"
                value={username}
                onChangeText={handleUsernameChange}
            />
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
            <View style={[styles.passwordContainer, { borderColor: passwordBorderColor }]}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={handlePasswordChange}
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
            {loading ? (
                <ActivityIndicator size="large" color={colors.blue} />
            ) : (
                <Button title="Sign Up" onPress={handleSignUpSubmit} />
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signUpLink}>Already have an account? Log In</Text>
            </TouchableOpacity>

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
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 8,
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
    usernameHint: {
        width: '100%',
        color: colors.red,
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4,
        marginVertical: 8,
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
        marginVertical: 8,
        paddingHorizontal: 8,
    },
    picker: {
        flex: 1,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    checkbox: {
        fontSize: 24,
        marginRight: 8,
        lineHeight: 24,
        marginTop: 5,
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
        marginTop: 16,
        color: 'blue',
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