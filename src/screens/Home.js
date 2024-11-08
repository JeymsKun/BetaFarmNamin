//This is Home.js
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home Screen</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  safeguardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, 
  },
});

export default Home;
