import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const PostDetail = ({ route }) => {
  const { post } = route.params;

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.galleryImage} />
  );

  return (
    <ScrollView style={styles.container}>
      <FlatList 
        data={post.images}
        renderItem={renderImage}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.imageGallery}
      />
      <View style={styles.details}>
        <Text style={styles.postName}>{post.name}</Text>
        <Text style={styles.postPrice}>{post.price}</Text>
        <Text style={styles.postDescription}>{post.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageGallery: {
    height: 300,
  },
  galleryImage: {
    width: 300,
    height: 300,
    marginHorizontal: 5,
  },
  details: {
    padding: 20,
  },
  postName: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    marginBottom: 10,
  },
  postPrice: {
    fontSize: 20,
    fontFamily: fonts.Regular,
    color: colors.primary,
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.gray,
  },
});

export default PostDetail;
