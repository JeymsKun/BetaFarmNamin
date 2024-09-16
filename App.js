import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import useFonts from './src/hooks/useFonts';
import SplashScreen from './src/components/SplashScreen'; 
import Login from './src/components/Login'; 
import SignUp from './src/components/SignUp';
import Homescreen from './src/components/Home';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f4511e',
  },
  headerTitle: {
    fontWeight: 'bold', 
    color: '#fff', 
  },
  headerTitleAlign: 'center', 
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Stack = createStackNavigator();

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fontsLoaded = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        setIsSplashVisible(false);
      }, 4000); 
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 5000, 
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 5000, 
              },
            },
          },
          ...TransitionPresets.FadeFromBottomAndroid,
        }}
      >
        {isSplashVisible ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={Login} 
              listeners={{
                focus: () => console.log('Navigating to Login screen'),
                blur: () => console.log('Navigated away from Login screen'),
              }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUp} 
              options={{
                headerShown: false, 
              }} 
            /> 
            <Stack.Screen 
              name="Home" 
              component={Homescreen} 
              options={{
                headerTitleAlign: styles.headerTitleAlign,
                headerStyle: styles.header, 
                headerTitleStyle: styles.headerTitle, 
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
