import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/colors';

export const loginUser  = async (username, password, role) => {
  const loginAPIURL = "http://192.168.1.56/farmnamin/login.php"; 

  const headers = {
    'Accept': 'application/json', 
    'Content-Type': 'application/json', 
  };

  const data = {
    username, 
    password,
    role, 
  };

  try {
    const response = await fetch(loginAPIURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data), 
    });

    const responseData = await response.json(); 

    if (responseData.Success) {
      return { 
        success: true, 
        id_user: responseData.id_user, 
        isInfoComplete: responseData.isInfoComplete 
      }; 
    } else {
      return { success: false, message: responseData.Message };
    }
  } catch (error) {
    return { success: false, message: "Error: " + error.message };
  }
};

export default function Login({ navigation, route }) {
  const { role } = route.params;
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Validation Error", "Please fill in both username and password.");
      return;
    }
  
    setLoading(true);
    const response = await loginUser (username, password, role);
  
    if (response.success) {
      const userId = response.id_user;

      if (!response.isInfoComplete) {
        console.log("User  info not completed. Navigating to Information screen.");
        navigation.navigate('Information', { userId });
      } else {
        console.log("User  info found. Navigating to HomeTabs.");
        navigation.navigate('HomeTabs');
      }
    } else {
      Alert.alert("Login Failed", response.message);
    }
  
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.usernameContainer}>
        <TextInput
          style={styles.usernameInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername} 
        />
      </View>

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
        <ActivityIndicator size={30} color={colors.blue} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeTabs')}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp', { role })}>
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