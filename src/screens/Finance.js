import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Image, StatusBar, TouchableOpacity, ScrollView, Button } from 'react-native';
import { PieChart } from 'react-native-chart-kit'; 
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route }) => {
    const navigation = useNavigation();
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("daily");

    
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

    const pieData = [
        {
            name: 'Total Expenses',
            population: 50,
            color: 'red',
            legendFontColor: 'black',
            legendFontSize: 11
        },
        {
            name: 'Savings',
            population: 50,
            color: 'blue',
            legendFontColor: 'black',
            legendFontSize: 12
        },

        {
            name: 'Investments',
            population: 50,
            color: 'yellow',
            legendFontColor: 'black',
            legendFontSize: 12
        },

        {
            name: 'Net Balance',
            population: 50,
            color: 'green',
            legendFontColor: 'black',
            legendFontSize: 12
            
        },

        
    ];

  return (
    <ScrollView style={styles.container} scrollEventThrottle={16}>
        <StatusBar hidden={false} />

        {/* Header */}
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                <Text style={styles.headerTitleText}>Hello, Jojo!</Text>
            </View>
            <View style={styles.headerGreet}>
                <Text style={styles.headerTitleText}>Let's trace and track your finances.</Text>
            </View>
        </View>

       {/* Statistics Container */}
       <View style={styles.statisticsContainer}>
            <View style={styles.rowStatistics}>
                <Text style={styles.title}>Statistics</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.rowDetailsPicker}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.textDetails}>You can view your overall finances here.</Text>
                </View>
                <View style={styles.wrapperPicker}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedPeriod(value)}
                        items={[
                            { label: 'Daily', value: 'daily' },
                            { label: 'Monthly', value: 'monthly' },
                            { label: 'Yearly', value: 'yearly' }
                        ]}
                        value={selectedPeriod}
                        placeholder={{ label: "Select period", value: null }}
                        style={styles.picker}
                    />
                </View>
            </View>

            {/* Pie Chart Section */}
            <View style={styles.pieContainer}>
                <Text style={styles.textTotal}>Total Income</Text>
                <Text style={styles.textAmount}>₱ 5,000.00</Text> 
                
                <PieChart
                    data={pieData}
                    width={width - 45}  
                    height={220}  
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 0, 
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                
                        },
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="10" 

                    chartLabel={(value) => `${value}%`}
                />
            </View>

        </View>

        <View style={styles.overviewContainer}>
            <View style={styles.rowOverview}>
                <Text style={styles.titleOverview}>Overview Balance</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black"/>
                </TouchableOpacity>
            </View>

            <View style={styles.detailsOverviewContainer}>
                <Text style={styles.textDetails}>You can set up a quick snapshot of your finances.</Text>

            </View>

        
            
        </View>

        <View style={styles.tagContainer}>
            <View style={styles.rowTag}>
                <Text style={styles.titleTag}>Tags for Monthly Budget</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.detailsTagContainer}>
                <Text style={styles.textTagDetails}>You can use tags to categories and track your monthly budget efficiently.</Text>

            </View>
            
        </View>

        <View style={styles.financeContainer}>
            <View style={styles.rowFinance}>
                <Text style={styles.title}>Finance Log</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.detailsFinanceContainer}>
                <Text style={styles.textFinanceDetails}>You can create to get a detailed record of all your transactions.</Text>

            </View>
            
        </View>


        <View style={styles.lineContainer}>
            <View style={[styles.line,{ flex: 1 } ]}/>
        </View>

        <View style={styles.createContainer}>
            <Text style={styles.createTitle}>Start monitoring your finances</Text>

            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createText}>Create overview balance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createText}>Create tags</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createText}>Create finance log</Text>
            </TouchableOpacity>
        </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    statisticsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    overviewContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
    },
    titleOverview: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
    },
    rowOverview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    detailsOverviewContainer: {
        justifyContent: 'center',
    },
    tagContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
    },
    detailsTagContainer: {
        justifyContent: 'center',
    },
    rowTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    textTagDetails: {
        fontSize: 9,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    titleTag: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    financeContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
    },
    detailsFinanceContainer: {
        justifyContent: 'center',
    },
    rowFinance: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    textFinanceDetails: {
        fontSize: 11,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    rowStatistics: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',  
        gap: 5, 
    },
    title: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
    },
    rowDetailsPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -10,
    },
    picker: {
    },
    picker: {
        inputIOS: {
            fontSize: 14,
            paddingVertical: 8,
            paddingHorizontal: 10,
            color: 'white', 
            textAlign: 'center',
            height: 40,
        },
        inputAndroid: {
            fontSize: 14,
            paddingHorizontal: 10,
            paddingVertical: 8,
            color: 'white', 
            textAlign: 'center',
        },
        placeholder: {
            color: 'white', 
        },
    },
    detailsContainer: {
        justifyContent: 'center', 
        alignItems: 'center',    
    },
    wrapperPicker: {
        width: '36%',
        backgroundColor: '#4CAF50', 
        borderRadius: 4,
        height: 30,
        justifyContent: 'center', 
    },
    textDetails: {
        fontSize: 11,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    pieContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        justifyContent: 'center',
        height: 280,
    },
    textTotal: {
        marginTop: 10,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    textAmount: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
    },
    createContainer: {
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 30,
    },
    createTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginBottom: 20,
        width: '100%',
        borderRadius: 20,
        alignItems: 'center',
    },
    createText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    lineContainer: {
        paddingHorizontal: 20,      
        alignItems: 'flex-start',  
    },  
    line: {
        marginTop: 50,
        borderBottomWidth: 8,
        borderColor: '#4CAF50',  
        borderRadius: 5,
        width: '100%',
        marginVertical: 10,
    },
    
});


export default ProductScreen;
