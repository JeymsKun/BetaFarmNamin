import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { getUserVerificationStatus, completeUserVerification } from '../utils/apiUtils'; 

const Safeguard = ({ username }) => {
  const [animation] = useState(new Animated.Value(0)); 
  const [isVerified, setIsVerified] = useState(false); 
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const status = await getUserVerificationStatus(username);
        setIsVerified(status === 'yes'); 
      } catch (error) {
        console.error('Failed to check verification status:', error);
      }
    };

    checkVerification();

    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [username]);

  const handleCompleteVerification = async () => {
    try {
      await completeUserVerification(username); 
      // Navigate to Profile screen after verification is complete
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Failed to complete verification:', error);
    }
  };

  if (isVerified) {
    return null; 
  }

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1], 
        }),
      },
    ],
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.message}>
          Hello There! Before you access the entire app, we need to do a verification.
          To ensure that a farmer or consumer is a legit person. If you have questions or feedback,
          you can chat us anytime.
        </Text>
        <Button title="Complete Verification" onPress={handleCompleteVerification} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // More opaque background for better focus
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it appears above other components
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default Safeguard;
