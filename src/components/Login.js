import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/colors';

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);

        if (!username || !password) {
            Alert.alert('Error', 'Please fill in both username and password');
            setLoading(false);
            return;
        }

        const loginAPIURL = "http://192.168.1.56/farmnamin/login.php";  // Update to your server's URL

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            username,
            password
        };

        fetch(loginAPIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
            setLoading(false);

            // Check if the response data has the expected structure
            if (Array.isArray(responseData) && responseData[0] && responseData[0].Message) {
                Alert.alert('Info', responseData[0].Message);
                if (responseData[0].Success) {
                    // Navigate to another screen or reset the form
                    navigation.navigate('Home'); // Change 'Home' to the appropriate screen
                }
            } else {
                Alert.alert('Error', 'Unexpected response format.');
            }
        })
        .catch(error => {
            setLoading(false);
            Alert.alert('Error', "Error: " + error.message);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.gray} />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color={colors.blue} />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
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
    signUpLink: {
        marginTop: 16,
        color: 'blue',
    },
});
