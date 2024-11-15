import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Role'); 
    }, 4000); 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop={false} 
        speed={0.5}
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'transparent',
        }}
        source={require('../../assets/sample.json')} 
      />
      <Text style={styles.title}>FARMNAMIN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.Bold,
    color: colors.blurryGreen,
    marginTop: 20,
  },
});
