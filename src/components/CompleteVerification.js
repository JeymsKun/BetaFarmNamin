import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const CompleteVerification = ({ navigation }) => {
    const [info, setInfo] = useState('');

    const handleSubmit = () => {
        if (!info) {
            Alert.alert('Error', 'Please provide the required information.');
            return;
        }

        // Make a request to update verification status in the database
        const updateVerificationAPIURL = "http://192.168.1.56/farmnamin/update_verification.php";

        fetch(updateVerificationAPIURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, info })
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                Alert.alert('Success', 'Your verification is complete!');
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Failed to complete verification.');
            }
        })
        .catch(error => {
            Alert.alert('Error', 'Error: ' + error.message);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Complete Verification</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter additional information"
                value={info}
                onChangeText={setInfo}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
});

export default CompleteVerification;
