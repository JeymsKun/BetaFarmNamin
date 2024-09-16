import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../utils/colors';

export default function SplashScreen() {
  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop
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
    fontFamily: 'Poppins-Bold',
    color: colors.blurryGreen,
  },
});
