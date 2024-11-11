import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Image, StatusBar, TouchableOpacity, ScrollView, Button } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import PlantingData from '../components/PlantingData';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState('January');
    const [year, setYear] = useState('2024');
    const [selectedDate, setSelectedDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthNumbers = {
        'January': '01',
        'February': '02',
        'March': '03',
        'April': '04',
        'May': '05',
        'June': '06',
        'July': '07',
        'August': '08',
        'September': '09',
        'October': '10',
        'November': '11',
        'December': '12'
    };

    const onMonthChange = (value) => {
        setMonth(value);
        setShowMonthPicker(false); 
    };

    const onYearChange = (value) => {
        setYear(value);
        setShowYearPicker(false); 
    };

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    const onShowCalendar = () => {
        setShowCalendar(false); 
        setTimeout(() => setShowCalendar(true), 0); 
    };

    const formatDate = (date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
        return 'Invalid Date';
        }
        return format(parsedDate, 'EEEE • MMMM d, yyyy • hh:mm a');
    };
    


  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentHeight - contentOffsetY <= layoutHeight + 50) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} onScroll={handleScroll} scrollEventThrottle={16}>
        <StatusBar hidden={false} />

        {/* Header */}
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                <Text style={styles.headerTitleText}>Hello, Jojo!</Text>
            </View>
            <View style={styles.headerGreet}>
                <Text style={styles.headerTitleText}>Today is Saturday!, October 19, 2024</Text>
            </View>
        </View>

      {/* Carousel Section */}
      <View style={styles.carouselSection}>

        <View style={styles.titleContainer}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Planting Calendar</Text>
            </View>
            <View style={styles.titleBy}>
                <Text style={styles.titleTextBy}>by Department of Agriculture</Text>
            </View>
        </View>

        <Carousel
            loop
            autoPlay
            autoPlayInterval={4000}
            width={width}
            height={width * 0.5}
            data={PlantingData}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={({ item }) => (
                <View style={styles.carouselItem}>
                    <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} resizeMode="cover"/>
                    {/* <ActivityIndicator size="large" color="green" /> */}
                </View>
            )}
        />
        <View style={styles.dotContainer}>
          {PlantingData.map((_, index) => (
            <View
                key={index}
                style={[styles.dot, { backgroundColor: activeIndex === index ? '#4AF146' : '#4CAF50' }]}
                />
            ))}
            </View>
        </View>

        <View style={styles.scheduleContainer}>
            <View style={styles.scheduleTitle}>
                <Text style={styles.scheduleText}>Your Schedule</Text>
            </View>

            <View style={[styles.line,{ flex: 1 } ]}/>
        </View>

        <View style={styles.calendarContainer}>

            <View style={styles.titleCalendar}>
                <Text style={styles.textCalendar}>Calendar</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={onMonthChange}
                        items={months.map((monthName) => ({
                            label: monthName,
                            value: monthName,
                        }))}
                        style={styles.picker}
                        value={month}
                    />
                </View>

                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={onYearChange}
                        items={[...Array(3000 - 2024 + 1)].map((_, index) => ({
                            label: String(2024 + index),
                            value: String(2024 + index),
                        }))}
                        style={styles.picker}
                        value={year}
                    />
                </View>

                <TouchableOpacity style={styles.showCalendarButton} onPress={onShowCalendar}>
                    <Text style={styles.showCalendarText}>Show Calendar</Text>
                </TouchableOpacity>

            </View>

             {/* Placeholder with conditional Calendar */}
             <View style={styles.placeholderContainer}>
                    {!showCalendar ? (
                        <Text style={styles.placeholderText}>Calendar will appear here</Text>
                    ) : (
                        <Calendar
                            current={`${year}-${monthNumbers[month]}-01`}
                            minDate={'2024-01-01'}
                            maxDate={'3000-12-31'}
                            onDayPress={onDayPress}
                            markedDates={{
                                [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: '#4CAF50' },
                            }}
                            style={ styles.calendar } 
                            theme={{
                                calendarBackground: 'transparent',
                                selectedDayBackgroundColor: '#4CAF50',
                                selectedDayTextColor: 'white',
                                todayTextColor: '#4CAF50',
                                dayTextColor: 'black',
                                textDisabledColor: '#585858',
                                arrowColor: '#4CAF50',
                                monthTextColor: 'black',
                                textSectionTitleColor: '#585858',
                                textDayFontFamily: 'Poppins-Regular',
                                textMonthFontFamily: 'Poppins-Bold',
                                textDayHeaderFontFamily: 'Poppins-Regular',
                                textDayFontSize: 12,
                                textMonthFontSize: 12,
                                textDayHeaderFontSize: 12,
                                'stylesheet.day.basic': { 
                                    base: {
                                        marginBottom: -10,
                                        borderRadius: 25,             
                                        width: 30,                   
                                        height: 30,       
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    },
                                },
                                
                                
                            }}
                        />

                    )}
                </View>

            <View style={styles.placeholderResult}>
                <Icon name="bell" size={18} color="green" />
                {selectedDate ? <Text style={styles.selectedDate}>Selected Date: {selectedDate}</Text> : null}
            </View>

            <TouchableOpacity style={styles.createScheduleButton} onPress={() => navigation.navigate('Scheduler')}>
                <Text style={styles.doneText}>Create Schedule</Text>
                <Feather name="arrow-right" size={30} color="#28B805" />
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
        titleContainer: {
        alignItems: 'center',  
        marginBottom: 10,      
    },
    titleText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center', 
        marginBottom: 0,
    },
    titleTextBy: {
        fontSize: 10,
        color: '#4CAF50',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',   
        marginTop: -5, 
    },
    carouselSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    carouselItem: {
        width: width,
        height: width * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    textContainer: {
        position: 'absolute',
        left: 10,
        bottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    dot: {
        margin: 3,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    scheduleContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,      
        alignItems: 'flex-start',  
    },  
    scheduleTitle: {

    },
    scheduleText: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    line: {
        marginTop: 50,
        borderBottomWidth: 8,
        borderColor: '#4CAF50',  
        borderRadius: 5,
        width: '100%',
        marginVertical: 10,
    },
    calendarContainer: {
        padding: 20,
    },
    titleCalendar: {
        paddingVertical: 10,    
        alignItems: 'flex-start',  
    },
    textCalendar: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerWrapper: {
        width: '33%',
        borderRadius: 20,
        backgroundColor: '#D9D9D9', 
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
    },
    picker: {
        inputIOS: {
            paddingHorizontal: 0,  
            paddingVertical: 5,    
            textAlign: 'center',
            fontSize: 12,          
            color: '#000',        
        },
        inputAndroid: {
            paddingHorizontal: 0,  
            paddingVertical: 5,   
            textAlign: 'center',
            fontSize: 12, 
            color: '#000', 
        },
    },
    showCalendarButton: {
        backgroundColor: '#4CAF50', 
        borderRadius: 20,
        paddingHorizontal: 10,
        height: 35, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    showCalendarText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
    },
    placeholderContainer: {
        backgroundColor: '#D9D9D9',  
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        marginBottom: 10,
        height: 300,
    },
    placeholderText: {
        color: '#585858',
        fontStyle: 'italic',
        fontSize: 18,
    },
    calendar: {
        width: '100%',
        marginBottom: 20,
    },
    createScheduleButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        padding: 5,
        marginTop: 50,
    },
    doneText: {
        padding: 5,
        fontSize: 14,
        color: "#28B805",  
        fontFamily: 'Poppins-Bold',
    },
    placeholderResult: {
        flexDirection: 'row',
        backgroundColor: '#D9D9D9',  
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        marginTop: 10,
        height: 100,
    },
    selectedDate: {
        color: '#585858',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    
});

export default ProductScreen;
