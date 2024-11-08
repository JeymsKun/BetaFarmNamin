import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/colors';

// Function to send login request to the backend
export const loginUser = async (username, password) => {
  const loginAPIURL = "http://192.168.1.56/farmnamin/login.php"; // URL for the PHP login API

  const headers = {
    'Accept': 'application/json', // API expects a JSON response
    'Content-Type': 'application/json', // Sending data in JSON format
  };

  const data = {
    username, // Username input by the user
    password, // Password input by the user
  };

  try {
    // Sending a POST request to the login API with the username and password
    const response = await fetch(loginAPIURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data), // Convert data to JSON format before sending
    });

    const responseData = await response.json(); // Parse the response as JSON

    // Check if login was successful based on the response from the server
    if (responseData.Success) {
      return { success: true, id_user: responseData.id_user }; // If login is successful, return the user ID
    } else {
      return { success: false, message: responseData.Message }; // If login fails, return the error message
    }
  } catch (error) {
    // Handle errors that occur during the fetch request
    return { success: false, message: "Error: " + error.message };
  }
};

export default function Login({ navigation }) {
  // State variables to store input values and UI states
  const [username, setUsername] = useState(''); // Username entered by the user
  const [password, setPassword] = useState(''); // Password entered by the user
  const [showPassword, setShowPassword] = useState(true); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State to show loading indicator during login process

  // Function to handle login button click
  const handleLogin = async () => {
    setLoading(true); // Show the loading indicator

    // Ensure both username and password fields are filled before proceeding
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both username and password'); // Show error alert if fields are empty
      setLoading(false); // Hide the loading indicator
      return;
    }

    // Call the loginUser function to send the login request to the server
    const result = await loginUser(username, password);

    setLoading(false); // Hide the loading indicator after the request is complete

    if (result.success) {
      // If login is successful, navigate to the Home screen, passing the user ID
      navigation.navigate('HomeTabs', { id_user: result.id_user });
    } else {
      // If login fails, show an alert with the error message
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title of the login screen */}
      <Text style={styles.title}>Login</Text>

      {/* Username input field */}
      <View style={styles.usernameContainer}>
        <TextInput
          style={styles.usernameInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername} // Updates username state when input changes
        />
      </View>

      {/* Password input field with visibility toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword} // Updates password state when input changes
          secureTextEntry={showPassword} // Controls whether the password is shown or hidden
        />

        {/* Icon to toggle password visibility */}
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Show a loading spinner while the login request is in progress */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.blue} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      )}

      {/* Link to navigate to the sign-up screen */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the login screen UI elements
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
    fontFamily: 'Poppins-Bold',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  usernameInput: {
    flex: 1,
    padding: 8,
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
  },
  signUpLink: {
    marginTop: 16,
    color: 'blue',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    width: 150,
    height: 40,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    textAlign: 'center',
  }
});
