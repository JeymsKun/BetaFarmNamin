import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, Text, View } from 'react-native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

export default function Homescreen() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/apple.png")} style={styles.logo}/>
      <Text style={styles.title}>APPLE BLUE</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.Bold,
  },
});
