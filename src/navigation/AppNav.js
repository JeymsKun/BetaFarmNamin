import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Easing } from 'react-native';
import useFonts from '../hooks/useFonts';
import SplashScreen from '../components/SplashScreen';
import Role from '../screens/Role';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Information from '../screens/Information';
import HomeTabs from '../components/HomeTabs';
import WebViewScreen from '../components/WebViewScreen';

const Stack = createStackNavigator();

const fontMap = {
  'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
  'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
  'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
};

const AppNav = () => {
  const fontsLoaded = useFonts(fontMap);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={25} color="#0000ff" />
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
                duration: 300,
                easing: Easing.out(Easing.ease),
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 300,
                easing: Easing.in(Easing.ease),
              },
            },
          },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                opacity: current.progress,
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Role" component={Role} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Information" component={Information} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="WebView" component={WebViewScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNav;
