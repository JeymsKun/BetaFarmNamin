import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar,  ScrollView } from 'react-native';
import { BackHandler } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');

export default function ShowFinancialAccount({ navigation, route }) {
    const { selectedAccount } = route.params;
    const [accountData, setAccountData] = useState([]);
    const [accountName, setAccountName] = useState('');

    useEffect(() => {
        const fetchAccountEntries = async () => {
            try {
                const response = await fetch(
                    `http://192.168.1.56/farmnamin/get_account_entries.php?account=${encodeURIComponent(selectedAccount)}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch account details');

                const data = await response.json();
                console.log('API Response:', data);

                if (data.Success) {
                    setAccountData(data.Entries); 
                    setAccountName(data.Account);
                } else {
                    setAccountData([]);
                    setAccountName('');
                }
            } catch (error) {
                console.error('Error fetching account details:', error);
            } 
        };

        if (selectedAccount) {
            fetchAccountEntries();
        }
    }, [selectedAccount]);

    
    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Finance');
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);


    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.rowProductTitle}>

                {/* Back Arrow */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>

                <View style={styles.textWithIcon}>
                    <Text style={styles.headerTextBottom}>
                        View Entries for {selectedAccount}
                    </Text>
                </View>
                
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {renderHeader()}
            <View style={styles.container}>
                <StatusBar hidden={false} />
                
                {/* Render accounts dynamically */}
                <ScrollView
                    contentContainerStyle={styles.scrollContentContainer}
                    showsVerticalScrollIndicator={false}
                > 
                    <View style={styles.accountWrapper}>
                        <View style={styles.accountContent}>
                            {/* Always show the account name */}
                            <Text style={styles.placeholderText}>
                                {accountName}
                            </Text>
                        </View>

                        <View style={styles.columnAccountContent}>
                            <Text style={styles.columnHeaderText}>Date</Text>
                            <Text style={styles.columnHeaderText}>Description</Text>
                            <Text style={styles.columnHeaderText}>Amount</Text>
                            <Text style={styles.columnHeaderText}>Type</Text>
                        </View>

                        {/* Show entries or 'You don't have entry yet' message */}
                        {accountData.length === 0 ? (
                            <Text style={styles.noDataText}>You don't have entry yet.</Text>
                        ) : (
                            accountData.map((entry) => (
                                <View key={entry.id} style={styles.columnAccountPlaceholder}>
                                    <Text style={styles.columnEntryText}>
                                        {new Date(entry.date).toLocaleString('default', { month: 'long' })}
                                        {'\n'}
                                        {new Date(entry.date).getDate()}, {new Date(entry.date).getFullYear()}
                                    </Text>
                                    <Text style={styles.columnEntryText}>{entry.description}</Text>
                                    <Text style={styles.columnEntryText}>
                                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(entry.amount)}
                                    </Text>
                                    <Text style={styles.columnEntryText}>{entry.type}</Text>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
        alignItems: 'stretch',
        paddingTop: height * 0.10, 
    },    
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.08,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        justifyContent: 'center',
        zIndex: 10,
    },
    rowProductTitle: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWithIcon: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    headerTextBottom: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: 'white',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        color: '#000',
    },    
    infoMessage: {
        position: 'absolute',
        top: height * 0.06,
        left: width * 0.2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        width: width * 0.6,
        borderRadius: 5,
        padding: 10,
        elevation: 5,
        zIndex: 20,
    },
    infoText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        color: '#333',
    },
    scrollContentContainer: {
        paddingBottom: 20,
        paddingHorizontal: width * 0.01, 
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },  
    accountWrapper: {
        marginVertical: 10,
        borderColor: '#ccc',
        borderRadius: 8,
    },   
    accountButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
    }, 
    accountContent: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    columnAccountContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    columnHeaderText: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    columnAccountPlaceholder: {
        flexDirection: 'row', 
        borderWidth: 1, 
        borderRadius: 8,
        marginVertical: 5,
        flex: 1, 
    },
    columnEntryText: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Poppins-Regular',
        flexWrap: 'wrap', 
        textAlign: 'center', 
        padding: 5,
        flex: 1
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#333',
    },
});
