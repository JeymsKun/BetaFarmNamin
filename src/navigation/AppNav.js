// src/navigation/AppNav.js
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Easing } from 'react-native';
import useFonts from '../hooks/useFonts';
import SplashScreen from '../components/SplashScreen';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import HomeTabs from '../components/HomeTabs'; 
import Profile from '../screens/Profile';
import PostDetail from '../components/PostDetails';
import EditProfile from '../components/EditProfile';
import ProductPost from '../screens/ProductPost';
import Post from '../screens/Post';
import ImageViewer from '../components/ImageViewer';
import VideoPlayer from '../components/VideoPlayer';
import AdditionalDetails from '../components/AdditionalDetails';

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
        <ActivityIndicator size="large" color="#0000ff" />
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
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name='PostDetail' component={PostDetail} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='ProductPost' component={ProductPost} />
        <Stack.Screen name='Post' component={Post} />
        <Stack.Screen name='ImageViewer' component={ImageViewer}/>
        <Stack.Screen name='VideoPlayer' component={VideoPlayer}/>
        <Stack.Screen name='AdditionalDetails' component={AdditionalDetails}/>
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
