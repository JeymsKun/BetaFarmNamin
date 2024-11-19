import React, { useRef, useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Animated, Dimensions } from 'react-native';
import HomeScreen from './../screens/Home'; 
import Calendar from './../screens/Calendar';
import ProductScreen from './../screens/Product'; 
import ProductPost from './../screens/ProductPost';
import Post from './../screens/Post';
import ImageViewer from './../components/ImageViewer';
import VideoPlayer from './../components/VideoPlayer';
import AdditionalDetails from './../components/AdditionalDetails';
import Scheduler from './../screens/Scheduler';
import Tips from './../screens/Tips';
import Weather from './../screens/Weather';
import Finance from './../screens/Finance';
import MarketPrice from './../screens/MarketPrice';
import ProfileScreen from './../screens/Profile'; 


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

const ProductStack = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Calendar" component={Calendar} />
      <Stack.Screen name="ProductPost" component={ProductPost} />
      <Stack.Screen name="Post" component={Post} />
      <Stack.Screen name="ImageViewer" component={ImageViewer} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
      <Stack.Screen name="AdditionalDetails" component={AdditionalDetails} />
      <Stack.Screen name="Scheduler" component={Scheduler} />
      <Stack.Screen name="Finance" component={Finance} />
      <Stack.Screen name="Weather" component={Weather} />
      <Stack.Screen name="Tips" component={Tips} />
      <Stack.Screen name="MarketPrice" component={MarketPrice} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};


const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const HomeTabs = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(width / 3);

  const animateLine = (index) => {
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const handleResize = () => {
      setTabWidth(Dimensions.get('window').width / 3);
    };

    const dimensionsHandler = Dimensions.addEventListener('change', handleResize);

    return () => {
      dimensionsHandler?.remove();
    };
  }, []);

  const screenOptions = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'HomeScreen') {
              iconName = 'home-outline';
            } else if (route.name === 'ProductScreen') {
              iconName = 'cart-outline';
            } else if (route.name === 'ProfileScreen') {
              iconName = 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: { 
            position: 'relative', 
            display: 'flex', 
            height: 65, 
            backgroundColor: '#f5f5f5',
          },
          tabBarLabelStyle: { fontSize: 14, fontFamily: 'Poppins-Bold', marginBottom: 9 }, 
          tabBarIconStyle: { size: 24, marginTop: 1 },
        })}
        screenListeners={({ route }) => ({
          tabPress: (e) => {
            let index;
            if (route.name === 'HomeScreen') {
              index = 0;
            } else if (route.name === 'ProductScreen') {
              index = 1;
            } else if (route.name === 'ProfileScreen') {
              index = 2;
            }
            animateLine(index);
          },
        })}
      >
        {/* HomeScreen Stack */}
        <Tab.Screen name="HomeScreen" component={HomeStack} options={{ title: 'Home' }}/>

        {/* ProductScreen Stack */}
        <Tab.Screen name="ProductScreen" component={ProductStack} options={{ title: 'Product' }} />

        {/* ProfileScreen Stack */}
        <Tab.Screen name="ProfileScreen" component={ProfileStack} options={{ title: 'Profile' }}/>
         
      </Tab.Navigator>

      {/* Animated line for tab indicator */}
      <Animated.View
        style={{
          justifyContent: 'center',
          position: 'absolute', 
          bottom: 5, 
          left: tabWidth / 6, 
          width: tabWidth / 1.5,
          height: 6, 
          backgroundColor: 'green',
          borderRadius: 3, 
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

export default HomeTabs;
