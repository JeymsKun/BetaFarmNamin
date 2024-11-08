import React, { useRef, useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Animated, Dimensions } from 'react-native';
import HomeScreen from './../screens/Home'; 
import ProductScreen from './../screens/Product'; 
import ProfileScreen from './../screens/Profile'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

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
          tabBarIconStyle: { size: 24, marginTop: -5, marginTop: 5, }, 
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
        <Tab.Screen name="HomeScreen" options={{ title: 'Home' }}>
          {() => (
            <Stack.Navigator screenOptions={screenOptions}>
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="ProductScreen" options={{ title: 'Product' }}>
          {() => (
            <Stack.Navigator screenOptions={screenOptions}>
              <Stack.Screen name="Product" component={ProductScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="ProfileScreen" options={{ title: 'Profile' }}>
          {() => (
            <Stack.Navigator screenOptions={screenOptions}>
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
      
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
