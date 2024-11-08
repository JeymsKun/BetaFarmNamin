// This is EditProfile.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { uploadDocument } from '../utils/apiUtils'; 

const EditProfile = () => {
  const [idCode, setIdCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idFrontImage, setIdFrontImage] = useState(null);
  const [idBackImage, setIdBackImage] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);

  const handleImagePick = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!idCode || !phoneNumber || !idFrontImage || !idBackImage || !documentImage) {
      alert('Please fill all fields and upload all images');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('idCode', idCode);
      formData.append('phoneNumber', phoneNumber);
      formData.append('idFrontImage', {
        uri: idFrontImage,
        type: 'image/jpeg',
        name: 'idFrontImage.jpg',
      });
      formData.append('idBackImage', {
        uri: idBackImage,
        type: 'image/jpeg',
        name: 'idBackImage.jpg',
      });
      formData.append('documentImage', {
        uri: documentImage,
        type: 'image/jpeg',
        name: 'documentImage.jpg',
      });

      const response = await fetch('http://yourserver.com/upload_document.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Documents uploaded successfully');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="ID Code"
        value={idCode}
        onChangeText={setIdCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity style={styles.button} onPress={() => handleImagePick(setIdFrontImage)}>
        <Text style={styles.buttonText}>Pick ID Front Image</Text>
      </TouchableOpacity>
      {idFrontImage && <Image source={{ uri: idFrontImage }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={() => handleImagePick(setIdBackImage)}>
        <Text style={styles.buttonText}>Pick ID Back Image</Text>
      </TouchableOpacity>
      {idBackImage && <Image source={{ uri: idBackImage }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={() => handleImagePick(setDocumentImage)}>
        <Text style={styles.buttonText}>Pick Document Image</Text>
      </TouchableOpacity>
      {documentImage && <Image source={{ uri: documentImage }} style={styles.image} />}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default EditProfile;
