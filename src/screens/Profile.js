import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ImageBackground, StatusBar, FlatList, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const user = {
  name: "James David R. Maserin",
  mobile: "09363932522",
  experience: "-----",
  bio: "Hard Working Po",
  reviews: [
    { id: 1, rating: 4, text: "Fresh and organic!", tags: ["organic", "fresh"] },
    { id: 2, rating: 5, text: "Affordable and great quality.", tags: ["affordable", "quality"] },
    { id: 3, rating: 3, text: "Good, but can improve.", tags: ["improving"] },
    { id: 4, rating: 2, text: "Your product is good. I really love it every time you do the post of that product. I appreciate your product and its quality", tags: ["awesome"] },
  ],
  products: [
    { id: 1, name: "Weed Cookie", price: "550.00", image: require('../assets/lavender.webp') },
    { id: 2, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 3, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 4, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 5, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 6, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 7, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 8, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 9, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 10, name: "Dako nga Talong per kilo", price: "5.00", image: require('../assets/product.png') },
    { id: 11, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 12, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 13, name: "Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') },
    { id: 14, name: "Palit namo grabe raba ni maka kuan. Dako nga Talong per kilo", price: "15.00", image: require('../assets/product.png') }
  ],
  coverPhoto: require('../assets/group.png'), 
  profileImage: require('../assets/apple.png'), 
};

const ProfileScreen = ({ navigation }) => {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [coverModalVisible, setCoverModalVisible] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [showMessage, setShowMessage] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const profileScale = useRef(new Animated.Value(1)).current;

  const handleVerifyPress = () => {
    setShowMessage(true);
    fadeAnim.setValue(1);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 6000, 
      useNativeDriver: true,
    }).start(() => {
      setShowMessage(false); 
    });
  };
  
  const handleCloseModal = (setModalVisible) => {
    Animated.timing(fadeAnim, {
      toValue: 0, 
      duration: 300, 
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false); 
      fadeAnim.setValue(1); 
    });
  };

  const animateProfile = () => {
    Animated.sequence([
      Animated.timing(profileScale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(profileScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setProfileModalVisible(true));
  };  

  const navigateToReviewScreen = () => {
    navigation.navigate('ReviewScreen'); 
  };

  const navigateToProductDetails = (productId) => {
    navigation.navigate('ProductDetailsScreen', { productId });
  };  

  const handleDotsClick = () => {
    navigation.navigate('EditProject'); 
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewContent}>
        <View style={styles.ratingContainer}>
          {Array.from({ length: 10 }, (_, i) => (
            <Icon
              key={i}
              name="star"
              size={15}
              color={i < item.rating ? '#FFD700' : '#CCCCCC'} 
              style={styles.starIcon}
            />
          ))}
        </View>
        <Text style={styles.reviewText}>
          {item.text.length > 30 ? `${item.text.substring(0, 30)}...` : item.text}
        </Text>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
  

  const renderProductItem = ({ item }) => {
    const nameFontSize = item.name.length > 20 ? 14 : 16;
  
    return (
      <View style={styles.productCard}>
        <TouchableOpacity onPress={() => navigateToProductDetails(item.id)}>
          <View style={styles.productImageContainer}>
            <Image source={item.image} style={styles.productImage} />
          </View>
        </TouchableOpacity>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { fontSize: nameFontSize }]}>
            {item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}
          </Text>
          <Text style={styles.productPrice}>₱{parseFloat(item.price).toFixed(2)}</Text>
        </View>
      </View>
    );
  };
  
  return (
    <FlatList
      ListHeaderComponent={
        <>
          <StatusBar hidden={false} />
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => setCoverModalVisible(true)}>
              <ImageBackground 
                source={user.coverPhoto} 
                style={styles.coverPhoto} 
                resizeMode="cover" 
              />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
            <Animated.View style={{ transform: [{ scale: profileScale }] }}>
              <TouchableOpacity onPress={animateProfile}>
                <View style={styles.profileImageContainer}>
                  <Image 
                    source={user.profileImage} 
                    style={styles.profileImage} 
                    resizeMode="contain" 
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>

              <TouchableOpacity onPress={() => handleDotsClick()}>
                <Icon name="more-horiz" size={30} color="green" style={styles.dotsIcon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleVerifyPress} style={styles.verifyIconContainer}>
                <Image 
                  source={require('../assets/verified-icon.png')}
                  style={styles.verifyIcon} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>

              {showMessage && (
                <Animated.View style={{ opacity: fadeAnim }}>
                  <Text style={styles.verifiedMessage}>This user is verified and trusted.</Text>
                </Animated.View>
              )}

            </View>
          </View>

          <View style={styles.allInfoContainer}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.mobile}>{user.mobile}</Text>
              <Text style={styles.experience}>{user.experience}</Text>
            </View>
            <View style={styles.bioContainer}>
                <Text style={styles.bioText}>{bio}</Text>
            </View>
          </View>

          <View style={styles.reviewContainer}>
            <TouchableOpacity onPress={navigateToReviewScreen}>
              <Text style={styles.reviewTitle}>Go to Consumer's Feedback</Text>
            </TouchableOpacity>
            <FlatList
              data={user.reviews}
              horizontal
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewList}
            />
          </View>

          <View style={styles.fixedTitleContainer}>
            <Text style={styles.sectionTitle}>Your Posted Products</Text>
          </View>

        </>
      }
      data={user.products}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.productsList}
      ListFooterComponent={
        <>
         <Modal
          visible={profileModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => handleCloseModal(setProfileModalVisible)}
        >
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity style={styles.modalBackground} onPress={() => handleCloseModal(setProfileModalVisible)}>
              <Image source={user.profileImage} style={styles.fullProfileImage} />
            </TouchableOpacity>
          </Animated.View>
        </Modal>

        <Modal
          visible={coverModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => handleCloseModal(setCoverModalVisible)}
        >
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity style={styles.modalBackground} onPress={() => handleCloseModal(setCoverModalVisible)}>
              <Image source={user.coverPhoto} style={styles.fullCoverImage} />
            </TouchableOpacity>
          </Animated.View>
        </Modal>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0, 
    padding: 0,
  },
  imageContainer: {
    width: '100%',         
    aspectRatio: 1.9,      
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },  
  headerContainer: {
    alignItems: 'center',
    marginTop: -80,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#00a400',
    borderWidth: 5,
    overflow: 'hidden', 
  },
  profileImage: {
    width: '100%', 
    height: '100%', 
  },
  verifyIconContainer: {
    position: 'absolute',
    top: 20, 
    right: 100, 
  },
  verifyIcon: {
    width: 40, 
    height: 40,
  },
  verifiedMessage: {
    marginTop: 3,
    color: '#1BA40F',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  dotsIcon: {
    marginLeft: 300,
    marginTop: -80,
    fontSize: 45,
  },
  allInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  userInfoContainer: {
    marginTop: 45,
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  mobile: {
    fontSize: 14,
    color: 'black',
    marginVertical: 5,
    fontFamily: 'Poppins-Medium',
  },
  experience: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Poppins-Medium',
  },
  bioContainer: {
    width: '100%',
    borderRadius: 10,
  },
  bioText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 6,
  },
  editButton: {
    padding: 5,
    borderRadius: 5,
  },
  edit: {
    color: '#2D8D2B',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 5,
  },
  updateButton: {
    padding: 5,
    borderRadius: 5,
  },
  update: {
    color: '#2D8D2B',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  reviewContainer: {
    width: '100%',
    padding: 10,
    height: 130, 
    marginLeft: 10,
  },
  reviewTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#4CAF50',
  },
  reviewList: {
    paddingVertical: 5,
    paddingRight: 30,
    paddingLeft: 10,
    flexGrow: 1,
  },
  
  reviewCard: {
    width: 200,
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  reviewContent: {
    flexDirection: 'column',
    marginLeft: 10, 
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    width: 10,
    height: 10,
  },
  reviewText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  tag: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 5,
  },
  tagText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },  
  fixedTitleContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    textAlign: 'left', 
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 5,
    marginHorizontal: 8,
  },
  productCard: {
    width: '50%', 
    padding: 15,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1, 
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#e0e0e0', 
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
  productInfo: {
    alignItems: 'left',
    marginTop: 5,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
    
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', 
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullProfileImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  fullCoverImage: {
    width: '90%',
    height: '50%',
    borderRadius: 20,
  },
  confirmationBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  confirmationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confirmButton: {
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'green',
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'red',
  },
  line: {
    height: 1, 
    backgroundColor: 'gray', 
    marginVertical: 5, 
    width: '100%', 
  },
  starIcon: {
    marginRight: 1,
  },
  

});

export default ProfileScreen;
