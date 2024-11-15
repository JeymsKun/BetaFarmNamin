import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Image, StatusBar, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const MarketScreen = ({ route }) => {
    const navigation = useNavigation();
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [noResultsMessage, setNoResultsMessage] = useState('');

    useEffect(() => {
        const clearMessage = () => {
            setShowInfoMessage(false);
        };

        let timer;
        if (showInfoMessage) {
            timer = setTimeout(clearMessage, 4000); 
        }

        return () => clearTimeout(timer); 
    }, [showInfoMessage]);

    const BulletLink = ({ text, url, stylePagasa }) => (
        <TouchableOpacity onPress={() => url && Linking.openURL(url)}>
            <View style={{ alignItems: 'center' }}>
                <Text style={[styles.linkText, stylePagasa]}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
    

  return (
    <ScrollView style={styles.container} scrollEventThrottle={16}>
        <StatusBar hidden={false} />

        {/* Header */}
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                <Text style={styles.headerTitleText}>Good Day, Jojo!</Text>
            </View>
            <View style={styles.headerGreet}>
                <Text style={styles.headerTitleText}>Ready to check the latest prices for your goods?</Text>
            </View>
        </View>

        {/* Agriculture and Fishery Market Price Container */}
        <View style={styles.marketPriceContainer}>
            <View style={styles.rowMarket}>
                <Text style={styles.titleMarket}>Agriculture and Fishery Market Price</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Latest Market Price Placeholder  Container */}
        <View style={styles.placeholderContainer}>
            <View style={styles.rowLatest}>
                <Text style={styles.titleLatest}>Latest Market Price</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black" />
                </TouchableOpacity>


            </View>
            
            {/* Move the Picker below the weather details */}
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker}>
                    
                </Picker>
            </View>

            <View style={styles.priceHolder}>
                <Text>price here</Text>
            </View>

        </View>

       {/* Market Price Container */}
       <View style={styles.marketContainer}>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <Text style={styles.searchTitle}>Discover Market: Unlock the Value of Your Agricultural Products!</Text>

                <TextInput
                    style={styles.searchBar}
                    placeholder="Search agriculture products..."
                    placeholderTextColor="#898989"
                />
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Loading Indicator */}
            {loading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={30} color="#4CAF50" />
            </View>
            )}

            {/* No Results Found Message */}
            {noResults && !loading && (
                <View style={styles.noResultContainer}>
                    <Text style={styles.noResultsText}>No Result? Let Us Know What You Need 😊</Text>

                    <View style={styles.messageButton}>
                        <TouchableOpacity>
                            <Text style={styles.messageText}>Message us here</Text>
                        </TouchableOpacity>
                        <Ionicons name="chatbubble-ellipses" size={18} color="#007AFF" style={styles.chatIcon} />
                    </View>
                
                </View>
            )}

                <View style={styles.noResultContainer}>
                    <Text style={styles.noResultsText}>No Result? Let Us Know What You Need 😊</Text>

                    <View style={styles.messageButton}>
                        <TouchableOpacity>
                            <Text style={styles.messageText}>Message us here</Text>
                        </TouchableOpacity>
                        <Ionicons name="chatbubble-ellipses" size={18} color="#007AFF" style={styles.chatIcon} />
                    </View>
                
                </View>

        </View>

        {/*More Information */}
        <View style={styles.informationContainer}>
            <Text style={styles.titleInformation}>For more information? Visit Them.</Text>

            <View style={styles.wrapperInformation}>
                <BulletLink text="Price Monitoring | Official Portal of the Department of Agriculture " stylePagasa={{ fontSize: 10 }} url="https://www.da.gov.ph/price-monitoring/"/>
            </View>
        </View>



    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {      
        paddingVertical: 20,
        paddingHorizontal: 20,      
        alignItems: 'flex-start',  
    },
    headerTitle: {
        marginBottom: 1,             
    },
    headerTitleText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    headerGreet: {
        marginTop: 1,                
    },
    headerGreetText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    marketPriceContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    placeholderContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    rowLatest: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',  
        gap: 5, 
    },
    titleLatest: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    pickerContainer: {
        marginTop: 10,
        height: 50,
        width: '100%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        overflow: 'hidden', 
    },
    picker: {
        height: '100%',
        backgroundColor: 'transparent', 
    },
    priceHolder: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        width: '100%',
        height: 300,
    },
    marketContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    rowMarket: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',  
        gap: 5, 
    },
    titleMarket: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
    },
    searchBarContainer: {
        position: 'relative',
        marginTop: 10,
    },
    searchTitle: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
    },
    searchBar: {
        marginTop: 5,
        paddingHorizontal: width * 0.05,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        fontSize: width * 0.040,
        color: 'black',
        height: 45,
        fontFamily: 'Poppins-Medium',
    },
    searchButton: {
        position: 'absolute',
        right: 15,
        top: '50%',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: height * 0.01,
    },
    noResultContainer: {
        margin: 50,
        padding: 10,
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    noResultsText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginBottom: 10,
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#2196F3', 
        marginRight: 5,
    },
    chatIcon: {
        marginLeft: 5,
    },
    linkText: {
        color: '#2196F3',
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-Regular',
    },
    informationContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },  
    titleInformation: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    wrapperInformation: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 2, 
    },

    
});


export default MarketScreen;
