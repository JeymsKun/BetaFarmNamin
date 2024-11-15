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
import Profile from '../screens/Profile';
import PostDetail from '../components/PostDetails';
import EditProfile from '../components/EditProfile';
import Product from '../screens/Product';
import ProductPost from '../screens/ProductPost';
import Post from '../screens/Post';
import ImageViewer from '../components/ImageViewer';
import VideoPlayer from '../components/VideoPlayer';
import AdditionalDetails from '../components/AdditionalDetails';
import Calendar from '../screens/Calendar';
import Scheduler from '../screens/Scheduler';
import Finance from '../screens/Finance';
import Weather from '../screens/Weather';
import Tips from '../screens/Tips';
import MarketPrice from '../screens/MarketPrice';

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
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="ProductPost" component={ProductPost} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="ImageViewer" component={ImageViewer} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
        <Stack.Screen name="AdditionalDetails" component={AdditionalDetails} />
        <Stack.Screen name="Scheduler" component={Scheduler} />
        <Stack.Screen name="Finance" component={Finance} />
        <Stack.Screen name="Weather" component={Weather} />
        <Stack.Screen name="Tips" component={Tips} />
        <Stack.Screen name="MarketPrice" component={MarketPrice} />
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
