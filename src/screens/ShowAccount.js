import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Animated, Modal } from 'react-native';
import { BackHandler } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFinancialLogs } from '../context/FinancialLogContext';
import { Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ShowFinancialAccount({ navigation }) {
    const { logs } = useFinancialLogs(); 
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showNoData, setShowNoData] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [showDeleteIcons, setShowDeleteIcons] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

    useEffect(() => {
 
        const unsubscribe = navigation.addListener('focus', () => {
            setAccounts([]);
        });

        return unsubscribe;  
    }, [navigation]); 
    
    const fetchAccounts = async () => {
        setIsLoading(true);  
        try {
            const response = await fetch('http://192.168.1.56/farmnamin/get_financial_accounts.php', {
                method: 'GET',
                credentials: 'include', 
            });

            if (!response.ok) {
                setShowNoData(true);  
                setTimeout(() => setShowNoData(false), 2000); 
                return;  
            }

            const data = await response.json();

            if (data.Success) {
                const fetchedAccounts = data.data.map(account => ({ account }));
                setAccounts(prevAccounts => {
                    const activeAccounts = prevAccounts.filter(account =>
                        fetchedAccounts.some(fetched => fetched.account === account.account)
                    );
                    return [...activeAccounts, ...fetchedAccounts];
                });
            } else {
                setShowNoData(true);  
                setTimeout(() => setShowNoData(false), 2000);
            }
        } finally {
            setIsLoading(false);  
        }
    };

    useEffect(() => {
        fetchAccounts();  
    }, [navigation]);
    

    useEffect(() => {
        if (logs.length > 0) {
            const uniqueLogAccounts = [...new Set(logs.map(log => log.account))];
            const logAccounts = uniqueLogAccounts.map(account => ({ account }));
    
            setAccounts(prevAccounts => {
                const combinedAccounts = [
                    ...prevAccounts,
                    ...logAccounts.filter(logAccount =>
                        !prevAccounts.some(prev => prev.account === logAccount.account)
                    ),
                ];
                return combinedAccounts;
            });
        }
    }, [logs]);     

    
    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Finance');
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);


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


    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch();
            }
        }, 300);
        
        return () => clearTimeout(debounceSearch);
    }, [searchQuery]);


    useEffect(() => {
        if (searchQuery.trim() === "") {
            setResults([]); 
            setIsSearchActive(false); 
        }
    }, [searchQuery]);
    

    const handleSearch = async () => {
        setIsLoading(true);
        const normalizeString = (str) => str.trim().toLowerCase();
        const normalizedQuery = normalizeString(searchQuery);

        const filteredResults = accounts.filter((item) =>
            normalizeString(item.account).includes(normalizedQuery)
        );

        if (filteredResults.length > 0) {
            setResults(filteredResults);
        } else {

            try {
                const response = await fetch(
                    `http://192.168.1.56/farmnamin/get_financial_accounts.php?query=${encodeURIComponent(
                        searchQuery
                    )}`,
                    { method: 'GET', credentials: 'include' }
                );

                if (!response.ok) throw new Error("Failed to fetch results from backend");

                const data = await response.json();

                if (data.Success && data.data.length > 0) {
                    setResults(data.data.map((account) => ({ account })));
                } else {
                    setShowNoData(true);
                    setTimeout(() => setShowNoData(false), 2000);
                }
            } catch (error) {
                console.error("Error fetching backend data:", error);
            }
        }

        setIsLoading(false);
    };
      

    const handleOutsideClick = () => {
        if (pop) {
            popOut(); 
            setShowCheckbox(false);
            setShowDeleteIcons(false);
            
        }
        if (isSearchActive) {
            setIsSearchActive(false); 
            setSearchQuery(""); 
            setResults([]);
            Keyboard.dismiss(); 
        }
    };    

    const [icon_1] = useState(new Animated.Value(40));
    const [icon_2] = useState(new Animated.Value(40));
    const [icon_3] = useState(new Animated.Value(40));
    const [rotation] = useState(new Animated.Value(0));

    const [pop, setPop] = useState(false);
    const [activePop, setActivePop] = useState(null);

    const popIn = () => {
        setPop(true);
        Animated.timing(icon_1,{
            toValue: 110,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2,{
            toValue: 95,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3,{
            toValue: 110,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start();
        Animated.timing(rotation, {
            toValue: 1, 
            duration: 300,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
    }

    const popOut = () => {
        setPop(false);
        setShowDeleteIcons(false); 
        setShowCheckbox(false);
        Animated.timing(icon_1,{
            toValue: 40,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2,{
            toValue: 40,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3,{
            toValue: 40,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
        }).start();
        Animated.timing(rotation, {
            toValue: 0, 
            duration: 300,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
    }
    
    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'], 
    });

    const toggleAccountSelection = (account) => {
        setSelectedAccounts((prev) =>
            prev.some((item) => item.id === account.id)
                ? prev.filter((item) => item.id !== account.id)
                : [...prev, account]
        );
    };

    const deleteAccountHandler = async (accountName) => {
        setIsLoading(true); 
        try {
            const response = await fetch(`http://192.168.1.56/farmnamin/delete_financial_account.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountName }),
                credentials: 'include',
            });
    
            if (!response.ok) throw new Error("Failed to delete account");
    
            const data = await response.json(); 
            if (data.Success) {
                // Update the local state to remove the deleted account
                setAccounts(prevAccounts => prevAccounts.filter(account => account.account !== accountName));

                setShowDeleteConfirmationModal(false); 
            } else {
                console.log("Delete failed:", data.Message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        } finally {
            setIsLoading(false);  
        }
    };    

    const confirmDelete = () => {
        if (accountToDelete) {
            deleteAccountHandler(accountToDelete.account); 
            setAccountToDelete(null); 
        }
    };

    const handleDeleteIconPress = (account) => {
        setAccountToDelete(account); 
        setShowDeleteConfirmationModal(true);
    };

    const toggleDeleteIcons = () => {
        if (showDeleteIcons) {
            setShowDeleteIcons(false); 
            setActivePop(null);
        } else {
            setShowDeleteIcons(true); 
            setShowCheckbox(false); 
            setActivePop(1); 
            popIn(); 
        }
    };

    const toggleCheckboxVisibility = () => {
        if (showCheckbox) {
            setShowCheckbox(false); 
            setActivePop(null); 
        } else {
            setShowCheckbox(true); 
            setShowDeleteIcons(false); 
            setActivePop(3); 
            popIn(); 
        }
    };

    const handlePlusNavigation = () => {
        popOut(); 
        setShowDeleteIcons(false); 
        setShowCheckbox(false); 
        navigation.navigate('FinancialLog');
    };

    const handleEditClick = (account) => {
        navigation.navigate('FinancialLog', { accountName: account.account });
    };    
    
    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.rowProductTitle}>

                {/* Back Arrow */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>

                {/* Centered Text with Question Icon or Search Input */}
                {isSearchActive ? (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="#585858"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />
                ) : (
                    <View style={styles.textWithIcon}>
                        <Text style={styles.headerTextBottom}>View Entries for -AccountName- </Text>
                        <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                            <AntDesign name="questioncircleo" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Search Icon */}
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => {
                        if (isSearchActive) {
                            handleSearch(); 
                        } else {
                            setIsSearchActive(true); 
                        }
                    }}
                >
                    <Feather name="search" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {showInfoMessage && (
                <View style={styles.infoMessage}>
                    <Text style={styles.infoText}>
                        This Product Management Tool allows you to manage your products efficiently. You can add, edit, and delete products as needed.
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={{ flex: 1 }}>
                {renderHeader()}
                <View style={styles.container}>
                    <StatusBar hidden={false} />
                    {/* Loading Indicator */}
                    {isLoading ? (
                        <View style={styles.centeredContainer}>
                            <ActivityIndicator size="large" color="#4CAF50" />
                        </View>
                    ) : (
                        <>
                            {/* Search Results */}
                            {showNoData ? (
                                <View style={styles.centeredContainer}>
                                    <Text style={styles.noDataText}>
                                        Sorry, but you don't have any financial accounts that match your search criteria.
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    {isSearchActive && results.map((result, index) => (
                                        <View key={index} style={styles.accountWrapper}>
                                            <TouchableOpacity style={styles.accountButton}>
                                                <Text style={styles.noDataText}>{result.account}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}                          
                                </>
                            )}
                        </>
                    )}

                    {/* Render accounts dynamically */}
                    <ScrollView
                        contentContainerStyle={styles.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {!isSearchActive && !searchQuery ? ( 
                            accounts.length === 0 && !hasSearched && !showNoData && !isLoading ? (
                                <Text style={styles.noDataText}>No accounts available yet</Text>
                            ) : (
                                accounts.map((account, index) => (
                                    <View key={index} style={styles.accountWrapper}>
                                        <View style={styles.accountButton}>
                                            <Text style={styles.placeholderText}>
                                                {account.account}
                                            </Text>

                                            {showCheckbox && (
                                                <>
                                                    <TouchableOpacity 
                                                        style={styles.checkboxIcon} 
                                                        onPress={() => toggleAccountSelection(account)}
                                                    >
                                                        <MaterialIcons
                                                            name={
                                                                selectedAccounts.some((item) => item.id === account.id)
                                                                    ? 'check-box' 
                                                                    : 'check-box-outline-blank'
                                                            }
                                                            size={24}
                                                            color="black"
                                                        />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={styles.editIcon}
                                                        onPress={() => handleEditClick(account)}
                                                    >
                                                        <AntDesign name="edit" size={24} color="black" />
                                                    </TouchableOpacity>
                                                </>
                                            )}

                                            {showDeleteIcons && (
                                                <TouchableOpacity
                                                    style={styles.deleteIcon}
                                                    onPress={() => handleDeleteIconPress(account)}
                                                >
                                                    <AntDesign name="delete" size={24} color="red" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))
                            )
                        ) : null}
                    </ScrollView>

                    
                    <Animated.View style={[styles.circlePop, {bottom: icon_1}]}>
                        <TouchableOpacity onPress={toggleDeleteIcons}>
                            <AntDesign name="delete" size={20} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={[styles.circlePop, {bottom: icon_2, right: icon_2}]}>
                        <TouchableOpacity onPress={handlePlusNavigation}>
                            <AntDesign name="plus" size={20} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={[styles.circlePop, {right: icon_3}]}>
                        <TouchableOpacity  onPress={toggleCheckboxVisibility}> 
                            <AntDesign name="select1" size={20} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity 
                        style={styles.circle} 
                        onPress={() => {
                            pop === false ? popIn() : popOut();
                        }}
                    >
                         <Animated.View style={{ transform: [{ rotate }] }}>
                            <AntDesign name="plus" size={24} color="white" />
                        </Animated.View>
                    </TouchableOpacity>


                </View>

                {/* Delete Financial Account Confirmation Modal */}
                <Modal visible={showDeleteConfirmationModal} transparent={true} animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Deleting this account could lead to deleting all your transactions. Are you sure you want to proceed?</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
                                    <Text style={styles.modalButtonTextYes}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => setShowDeleteConfirmationModal(false)}>
                                    <Text style={styles.modalButtonTextNo}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    headerTextBottom: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: 'white',
        marginRight: 5,
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
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 10,
        width: '100%',
        padding: 5, 
    },    
    accountButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    deleteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    placeholderText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    checkboxIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    editIcon: {
        position: 'absolute',
        top: 10,
        right: 50,  
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#333',
    },
    resultText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#333',
        marginVertical: 10,
    },
    circle: {
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50, 
        position: 'absolute',
        bottom: 35,
        right: 35,
        borderRadius: 25, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    circlePop: {
        backgroundColor: '#4CAF50',
        width: 40,
        height: 40, 
        position: 'absolute',
        bottom: 40,
        right: 40,
        borderRadius: 25, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    modalMessage: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginVertical: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 10,
    },
    modalButtonTextYes: {
        fontSize: 14,
        color: '#4CAF50',
        fontFamily: 'Poppins-Medium',
    },
    modalButtonTextNo: {
        fontSize: 14,
        color: '#F44336',
        fontFamily: 'Poppins-Medium',
    },
});
