import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, TextInput, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import { BackHandler } from 'react-native';
import { format } from 'date-fns';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import CustomAlert from '../components/CustomAlert';
import { v4 as uuidv4 } from 'uuid';
import { useFinancialLogs } from '../context/FinancialLogContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const MAX_LENGTH = 30;

const financialAPIURL = "http://192.168.1.56/farmnamin/financial_record.php";

export default function FinancialLog({ navigation, route }) {
    const { entry } = route.params || {};
    // const [description, setDescription] = useState(balanceToEdit ? balanceToEdit.description : '');
    // const [selectedDate, setSelectedDate] = useState(scheduleToEdit ? scheduleToEdit.date : null);
    const [account, setAccount] = useState(entry ? entry.account : '')
    const [description, setDescription] = useState(entry ? entry.description : '');
    const [amount, setAmount] = useState(entry ? entry.amount : '');
    const [type, setType] = useState(entry ? entry.type : '');
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(entry ? entry.date : '');
    const [accountFocused, setAccountFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [amountFocused, setAmountFocused] = useState(false);
    const [typeFocused, setTypeFocused] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isDateCanceled, setIsDateCanceled] = useState(false);
    const [isDateError, setIsDateError] = useState(false);
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [balanceDeleteConfirmationVisible, setBalanceDeleteConfirmationVisible] = useState(false);
    const [balanceConfirmationVisible, setBalanceConfirmationVisible] = useState(false);
    // const { balance, setBalance } = useSchedules();
    // const [isUpdate, setIsUpdate] = useState(!!balanceToEdit);  
    const [isUpdate, setIsUpdate] = useState(null);
    const validTypes = ['Income', 'Expense', 'Saving', 'Investment'];
    const { logs, setLogs } = useFinancialLogs();
    const [balances, setBalances] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
                
                fetchEntries(); 
            });

            return unsubscribe;
    }, [navigation]);

    const fetchEntries = async () => {
        const accountName = route.params?.accountName || route.params?.account_name;
        if (!accountName) {
            return;
        }
    
        try {
            const response = await axios.get('http://192.168.1.56/farmnamin/get_entries.php', {
                params: { account_name: accountName },
            });
    
            if (response.data && response.data.Success) {
                const entries = response.data.Records || [];
                const formatDate = (date) => {
                    return format(new Date(date), 'MMMM dd, yyyy');
                };
    
                const formattedEntries = entries.map(entry => ({
                    description: entry.description,
                    amount: entry.amount,
                    type: entry.type,
                    record_date: formatDate(entry.date),
                }));
    
                setBalances([{
                    account: accountName,
                    balances: formattedEntries,
                }]);
            } else {
                setBalances([]);
                console.error(response.data?.Message || "Failed to fetch entries");
            }
        } catch (error) {
            console.error("Error fetching entries:", error);
            setBalances([]);
        }
    };

    
    useEffect(() => {
        if (logs.length > 0) {
            const existingAccount = logs.find(log => log.account === account);
            setBalances(existingAccount ? [existingAccount] : []);
            
        } else {
            setBalances([]);
            
        }
    }, [logs, account]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            resetForm();

            const existingAccount = logs.find(log => log.account === entry ? entry.account : account);
            setBalances(existingAccount ? [existingAccount] : []);
    
            if (entry) {
                setAccount(entry.account); 
                setDescription(entry.description);
                setAmount(entry.amount);
                setType(entry.type);
                setSelectedDate(entry.date);
            } else {
                setAccount(''); 
                setDescription('');
                setAmount('');
                setType('');
                setSelectedDate(''); 
            }
            
        });
    
        return unsubscribe;
    }, [navigation, entry, logs]);      

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Account'); 
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

    const renderHeader = () => (
        <View style={styles.header}>

        <Text style={styles.headerTextTop}>Welcome to</Text>

        <View style={styles.headerRow}>
            <View style={styles.rowProductTitle}>
            <Text style={styles.headerTextBottom}>Product Management Tool</Text>
            <TouchableOpacity style={styles.questionInfo} onPress={() => setShowInfoMessage((prev) => !prev)}>
                <AntDesign 
                name="questioncircleo" 
                size={12} 
                color="white" 
                style={styles.iconSpacing} 
                />
            </TouchableOpacity>
            </View>
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
    
    const handleConfirm = () => {
        setIsConfirmationModalVisible(false);
        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);

            const updatedBalance = {
            id: isUpdate ? balanceToEdit.id : uuidv4(), 
            amount: amount,
            description: description,
            type: type,

            };

            if (isUpdate) {
            setSchedules((prevBalance) => 
                prevBalance.map((balance) =>
                    balance.id === balanceToEdit.id ? updatedBalance : balance
                )
            );
            } else {

            setSchedules((prevBalance) => [...prevBalance, updatedBalance]);
            }
        
            navigation.navigate('Finance');
        }, 3000);
    };

    const handleAddEntry = () => {
        const isDescriptionEmpty = description.trim() === '';
        const isAmountEmpty = amount.trim() === '';
        const isTypeEmpty = type.trim() === '';
        const isDateEmpty = selectedDate === '';

        const isTypeValid = validTypes.includes(type.trim());

        const requiresAccountName = balances.length === 0 || !balances[0].account;
        const isAccountEmpty = requiresAccountName && account.trim() === '';
       
        if (isAccountEmpty || isDescriptionEmpty || isAmountEmpty || isTypeEmpty || isDateEmpty) {
            if (requiresAccountName) setAccountFocused(isAccountEmpty);
                setDescriptionFocused(isDescriptionEmpty);
                setAmountFocused(isAmountEmpty);
                setTypeFocused(isTypeEmpty);
                setIsDateError(isDateEmpty);
            return;
        } else if (!isTypeValid) {
                console.log('Invalid type. Please enter a valid type.');
                setTypeFocused(true);
            return;
        } 

        const existingAccount = balances.find(balance => balance.account === account.trim());
        
        let accountId;
        if (existingAccount) {
            accountId = existingAccount.id; 
        } else {
            accountId = uuidv4(); 
            const newAccountEntry = {
                id: accountId,
                account: account.trim(),
                balances: [] 
            };
            setBalances(prev => [...prev, newAccountEntry]);
        }

        const formattedDateNewEntry = format(new Date(selectedDate), 'MMMM dd, yyyy');

        const newEntry = {
            id: uuidv4(),
            accountId: accountId,
            description: description.trim(),
            amount: amount.trim(),
            type: type.trim(),
            record_date: formattedDateNewEntry || '', 
        };

        setBalances(prev => 
            prev.map(balance => 
                balance.id === accountId 
                    ? { ...balance, balances: [...balance.balances, newEntry] } 
                    : balance
            )
        );

        const formattedAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ''));

        const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; 

        axios.post(financialAPIURL, {
            account_name: account.trim() || (balances.length > 0 ? balances[0].account : ""),
            description: description.trim(),
            amount: formattedAmount, 
            type: type.trim(),
            record_date: formattedDate, 
        })
        .then(response => {
            console.log('Entry added successfully to the backend:', response.data);
            fetchEntries();

            resetForm();
        })
        .catch(error => {
            console.error('Error adding entry to the backend:', error);

        });
        console.log({
            account_name: existingAccount ? existingAccount.account : account.trim(),
            description: description.trim(),
            amount: formattedAmount,
            type: type.trim(),
            record_date: formattedDate,
        });
    };

    const normalizeTypeInput = (input) => {
        const normalized = input.toLowerCase().trim(); 
        
        switch (normalized) {
            case 'income':
            case 'incomes':
            case 'Incomes':
                return 'Income';
            case 'expense':
            case 'expenses':
            case 'Expenses':
                return 'Expense';
            case 'saving':
            case 'savings':
            case 'Savings':
                return 'Saving';
            case 'investment':
            case 'investments':
            case 'Investments':
                return 'Investment';
            default:
                return input.trim(); 
        }
    };

    const handleTypeInput = (text) => {
        const normalizedText = normalizeTypeInput(text);
        setType(normalizedText);
    };

    const formatAmount = (amount) => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) return "₱0.00"; 
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(parsedAmount);
    };

    const handleDescriptionChange = (text) => {
        if (text.length <= MAX_LENGTH) {
            setDescription(text);
        }
    };
    
    const handleCancel = () => {
        setIsConfirmationModalVisible(false); 
    };

    const handleEdit = () => {
        if (account.trim() === '') {
            setIsAlertVisible(true);
        }

        const updatedEntry = {
            id: entry.id,
            account: account,
            description: description,
            amount: amount,
            type: type,
            date: selectedDate,
        };

        setLogs((prevLogs) =>
            prevLogs.map((log) => (log.id === entry.id ? updatedEntry : log))
        );

        navigation.navigate('Account', { account: updatedEntry });
    };

    const handleDone = () => {
        if (entry) {
            handleEdit(); 
        } else {
            handleAddEntry(); 
        }
    
        const latestEntry = {
            id: uuidv4(),
            account: account.trim(),
            description: description.trim(),
            amount: amount.trim(),
            type: type.trim(),
            date: selectedDate,
        };
    
        setLogs(prevLogs => [...prevLogs, latestEntry]);
        navigation.navigate('Account', { account: latestEntry });
    };
  
    const renderAlertMessage = () => {
        if (amount.trim() === '') {
            return 'Your Amount is empty.';
        } else if (description.trim() === '') {
            return 'Your description is empty.';
        } else if (type.trim() === '') {
            return 'Your type is empty.';
        } else {
            return 'Your amount, description, type are empty';
        }
    };   

    const handleDeleteBalance = () => {
        setBalanceDeleteConfirmationVisible(true);
    };

    const confirmDeleteBalance = () => {
        setBalanceDeleteConfirmationVisible(false);
        setAmount('');
        setDescription('');
        setType('');
        setAmountFocused(false);
        setDescriptionFocused(false);
        setTypeFocused(false);
    };

    const handleAddNewBalance = () => {
        setBalanceConfirmationVisible(true);
    };

    const confirmAddNewBalance = () => {
        setBalanceConfirmationVisible(false);
        // setIsUpdate(false);
        setAccount('');
        setDescription('');
        setAmount('');
        setType('');
        setSelectedDate('');
        setAccountFocused(false);
        setDescriptionFocused(false);
        setAmountFocused(false);
        setTypeFocused(false);
        setIsDateCanceled(false);
    };

    const handleSelectDate = () => {
        setShowDatePicker(true);
        setIsDateCanceled(false);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'dismissed') {
            setIsDateCanceled(true); 
        } else if (selectedDate) {
            const today = new Date();
            const selectedDateObj = new Date(selectedDate);
    
            selectedDateObj.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
    
            if (selectedDateObj < today) {
                setIsDateError(true);
            } else {
                setIsDateError(false); 
            }
    
            const formattedDate = selectedDateObj.toISOString().split('T')[0]; 
            setSelectedDate(formattedDate); 
        }
    };

    const resetForm = () => {
        setDescriptionFocused(false);
        setAmountFocused(false);
        setTypeFocused(false);
        setIsDateError(false);
        setDescription('');
        setAmount('');
        setType('');
        setSelectedDate('');
    };
  
  return (
    <>
        {renderHeader()}
        <ScrollView style={styles.container}>
            <StatusBar hidden={false} />

            <View style={styles.balanceContainer}>
                <Text style={styles.sectionTitle}>Create Financial Log</Text>

                <View style={styles.wrapperButtons}>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddNewBalance}>
                        <View style={styles.iconTextRow}>
                            <AntDesign name="pluscircleo" size={20} color="black" />
                            <Text style={styles.buttonText}>Add New Log</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteBalance}>
                        <View style={styles.iconTextRow}>
                            <AntDesign name="delete" size={20} color="black" />
                            <Text style={styles.buttonText}>Delete Log</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate('Account')}>
                    <View style={styles.iconTextRow}>
                        <AntDesign name="filetext1" size={20} color="black" />
                        <Text style={styles.buttonText}>View Logs</Text>
                    </View>
                </TouchableOpacity>

            </View>

            <View style={styles.placeholderBalanceContainer}>
                <View style={styles.placeholderBalance}>
                    <View style={styles.placeholderBalanceName}>
                        <Text style={balances.length > 0 ? styles.nameText : styles.noAccountText}>
                            {balances.length > 0 ? balances[0].account : "No Account Name"}
                        </Text>
                    </View>
                    <View style={styles.placeholderBalanceResult}>
                    {balances && balances.length > 0 ? (
                            balances[0].balances && balances[0].balances.length > 0 ? (
                                balances[0].balances.map((entry, index) => (
                                    <View key={entry.id || index} style={styles.entryRow}>
                                        <View>
                                            <Text style={styles.dateText}>
                                                {entry.record_date || "No Date Available"}
                                            </Text>
                                            <Text style={styles.resultText}>
                                                {`${entry.description || ""}    ${formatAmount(entry.amount || "")}       ${entry.type || ""}`}
                                            </Text>
                                        </View>

                                        {index < balances[0].balances.length - 1 && <View style={styles.separatorLine} />}
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noEntriesText}>No Entries Yet</Text>
                            )
                        ) : (
                            <Text style={styles.noEntriesText}>No Accounts Yet</Text>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.inputContainer}>
                {!balances.length || !balances[0].account ? (
                    <>
                        <Text style={styles.inputTitles}>Account Name</Text>
                        <View style={[styles.inputWrapper, accountFocused && account.length === 0 && styles.errorBorder]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Add Account Name"
                                value={account}
                                onChangeText={setAccount}
                                onFocus={() => setAccountFocused(true)} 
                                onBlur={() => setAccountFocused(false)}
                            />
                        </View>
                    </>
                ) : null}
                <Text style={styles.inputTitles}>Name, Description, or Title</Text>
                <View style={[styles.inputWrapperDescription, descriptionFocused && description.length === 0 && styles.errorBorder]}>
                    <TextInput
                        style={styles.inputDescription}
                        placeholder="Add Name, Description, or Title"
                        value={description}
                        onChangeText={handleDescriptionChange}
                        multiline
                        scrollEnabled={false}
                        onFocus={() => setDescriptionFocused(false)} 
                        onBlur={() => setDescriptionFocused(true)}
                    />
                    <Text style={[styles.characterCount, descriptionFocused && description.length === 0 && styles.errorCharacterCount]}>
                        {`${description.length}/${MAX_LENGTH}`}
                    </Text>
                </View>
                <Text style={styles.inputTitles}>Amount</Text>
                <View style={[styles.inputWrapper, amountFocused && amount.length === 0 && styles.errorBorder]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add Amount"
                        value={amount}
                        keyboardType="numeric"
                        onChangeText={setAmount}
                        onFocus={() => setAmountFocused(false)}
                        onBlur={() => setAmountFocused(true)}
                    />
                </View>
                <Text style={styles.inputTitles}>Type</Text>
                <View style={[styles.inputWrapper, typeFocused && (type.length === 0 || !validTypes.includes(type.trim())) && styles.errorBorder]}>
                    <TextInput
                        style={styles.inputType}
                        placeholder="Add Type (Income, Expense, Saving, or Investment)"
                        value={type}
                        onChangeText={handleTypeInput}
                        onFocus={() => setTypeFocused(false)}
                        onBlur={() => setTypeFocused(true)}
                    />
                </View>

                <View style={styles.dateWrapper}>
                    <Text style={styles.inputTitles}>Set a Date</Text>

                    {/* Display selected date if available */}
                    <View style={[styles.selectorContainer, 
                        (isDateError || (isDateCanceled && !selectedDate)) && styles.errorBorder
                    ]}> 
                    {selectedDate ? (
                        <Text style={styles.selectedDateTimeText}>
                            {format(new Date(selectedDate), 'MMMM dd, yyyy')}
                        </Text>
                    ) : (
                        <Text style={styles.noSelectDateText}>
                            No Selected Date
                        </Text>
                    )}
                    </View>
                    
                    <TouchableOpacity style={styles.dateTimePickerButton} onPress={handleSelectDate}>
                        <Text style={styles.pickerButtonText}>Select Date</Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate ? new Date(selectedDate) : date} 
                        mode="date" 
                        display="calendar"
                        onChange={onDateChange}
                        minimumDate={new Date()}  
                    />
                )}

            </View>

            <View style={styles.entryWrapper}>
                <TouchableOpacity
                    style={styles.entryButton}
                    onPress={handleAddEntry}
                >
                    <Text style={styles.entryText}>
                        Add Entry
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Done Button at the bottom */}
            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                    <Text style={styles.doneText}>{entry ? 'Update' : 'Done'}</Text>
                    <Feather name="arrow-right" size={30} color="#28B805" />
                </TouchableOpacity>
            </View>

        </ScrollView>


        {/* Confirmation Modal */}
        <Modal visible={isConfirmationModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Are you sure you want to {isUpdate ? 'update' : 'create'} this overview balance?</Text>
                    <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton}>
                        <Text style={styles.modalButtonTextYes}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                        <Text style={styles.modalButtonTextNo}>No</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        <CustomAlert
            visible={isAlertVisible}
            title={'Empty'}
            message={renderAlertMessage()}
            onClose={() => setIsAlertVisible(false)}
        />

        {/* Loading Modal */}
        <Modal visible={isLoading} transparent={true} animationType="fade">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
                    <ActivityIndicator size={50} color="#4CAF50" />
                    <Text style={{ marginTop: 10, fontFamily: 'Poppins-Medium', color: 'white' }}>{isUpdate ? 'Updating your overview balance...' : 'Calculating your overview balance...'}</Text>
                </View>
            </View>
        </Modal>

        {/* Add New Balance Confirmation Modal */}
        <Modal visible={balanceConfirmationVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Are you sure you want to add a new balance?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalButton} onPress={confirmAddNewBalance}>
                            <Text style={styles.modalButtonTextYes}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setBalanceConfirmationVisible(false)}>
                            <Text style={styles.modalButtonTextNo}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Delete Balance Confirmation Modal */}
        <Modal visible={balanceDeleteConfirmationVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Are you sure you want to delete all balance?</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteBalance}>
                        <Text style={styles.modalButtonTextYes}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setBalanceDeleteConfirmationVisible(false)}>
                        <Text style={styles.modalButtonTextNo}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
    },
    header: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: height * 0.08,
        backgroundColor: '#4CAF50', 
        padding: width * 0.02,
        zIndex: 10, 
    },
    headerTextTop: {
        fontSize: width > 400 ? 16 : 12,
        fontFamily: 'Poppins-Bold',
        color: 'white',
        paddingHorizontal: 10, 
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10, 
    },  
    rowProductTitle: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        flexWrap: 'wrap',
    },
    iconSpacing: {
        padding: 5,
    },
    headerTextBottom: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: 'white',
    },
    infoMessage: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        textAlign: 'center',
        width: '90%',
        height: height * 0.1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 1,
        elevation: 3, 
        zIndex: 10, 
    },
    infoText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        color: '#333',
        fontSize: 10,
        color: '#333',
    },
    infoMessageAdditional: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        bottom: 25,
        width: '90%',
        height: height * 0.25,
        borderRadius: 5,
        padding: 10,
        elevation: 3, 
        zIndex: 10,
    },
    balanceContainer: {
        marginTop: 50,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: 'black',
    },
    wrapperButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addButton: {
        paddingVertical: 10,
        borderRadius: 5,
    },
    deleteButton: {
        paddingVertical: 10,
        borderRadius: 5,
    },
    viewButton: {
        borderRadius: 5,
    },
    iconTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 5,
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontFamily: 'Poppins-Medium',
        color: '#4CAF50',
    },
    placeholderBalanceContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 20,
    },
    placeholderBalance: {
        borderWidth: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    placeholderBalanceName: {
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        height: 'auto',
        minHeight: 50,
    },
    placeholderBalanceResult: {
        borderWidth: 1,
        marginTop: 20,
        padding: 10,
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        height: 'auto',
        minHeight: 200,
    },
    nameText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#333',
    },
    resultText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    editDeleteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',  
        alignItems: 'center',           
        paddingHorizontal: width * 0.05, 
        marginBottom: 5,
    },
    balanceButton: {
        backgroundColor: '#4CAF50', 
        borderRadius: 20,
    },
    editText: {
        color: 'white',
        fontSize: width * 0.035, 
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: 12,   
    },
    deleteText: {
        color: 'white',
        fontSize: width * 0.035,
        fontFamily: 'Poppins-Regular', 
        paddingHorizontal: 12,
    },
    cancelText: {
        color: 'white',
        fontSize: width * 0.035,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: 12,
    },
    entryRow: {
        marginBottom: 10,
    },
    dateText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    separatorLine: {
        height: 1,
        backgroundColor: 'black',
    },
    noEntriesText: {
        fontSize: 16,
        color: '#777',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    noAccountText: {
        fontSize: 16,
        color: '#777',
        fontFamily: 'Poppins-Regular',
    },
    inputContainer: {
        marginTop: 20,
    },
    inputTitles: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    characterCount: {
        fontFamily: 'Poppins-Regular',
        textAlign: 'right',
        padding: 5, 
        color: 'gray',
        marginTop: 5,
    },
    errorCharacterCount : {
        color: '#F44336',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(27, 164, 15, 0.31)',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    inputWrapperDescription: {
        marginBottom: 20,
        backgroundColor: 'rgba(27, 164, 15, 0.31)',
        borderRadius: 5,
        height: 100,
    },
    inputDescription: {
        color: 'black',
        fontSize: 13,
        fontFamily: 'Poppins-Medium',
        marginHorizontal: 8,
        padding: 10,
        flex: 1, 
        textAlignVertical: 'top',
    },
    input: {
        color: 'black',
        fontSize: 13,
        fontFamily: 'Poppins-Medium',
        marginHorizontal: 5,
        padding: 10,
        flex: 1, 
    },
    inputType: {
        color: 'black',
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        marginHorizontal: 5,
        padding: 10,
        flex: 1, 
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: '#F44336',
    },
    wrapper: {
        flex: 1,
        margin: 10,
    },
    selectorContainer: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    selectedDateTimeText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: 'black',
    },
    noSelectDateText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: '#777',
    },
    dateTimePickerButton: {
        backgroundColor: '#4CAF50', 
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        alignItems: 'center',
    },
    pickerButtonText: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
    },
    entryWrapper: {
        marginTop: 20,
    },
    entryButton: {
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        padding: 10,
    },
    entryText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    doneButton: {
        flexDirection: 'row',
        padding: 5,
    },
    doneText: {
        padding: 5,
        fontSize: 14,
        color: "#28B805",  
        fontFamily: 'Poppins-Bold',
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
