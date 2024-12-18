import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Image, StatusBar, TouchableOpacity, ScrollView, Button } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import PlantingData from '../components/PlantingData';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSchedules } from '../context/ScheduleContext';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, 
});

const CalendarScreen = ({ route }) => {
    const { schedules, setSchedules } = useSchedules();
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState('January');
    const [year, setYear] = useState('2024');
    const [selectedDateCalendar, setSelectedDateCalendar] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    useEffect(() => {
        const { newSchedule } = route.params || {}; 
        if (newSchedule && !schedules.some(schedule => schedule.id === newSchedule.id)) {
            setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
        }
    }, [route.params, schedules, setSchedules]);  

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
    };

    const onYearChange = (value) => {
        setYear(value);
    };

    const philippineEvents = [
        { dateEvent: '2024-01-01', descriptionEvent: 'New Year\'s Day' },
        { dateEvent: '2024-02-25', descriptionEvent: 'EDSA People Power Revolution Anniversary' },
        { dateEvent: '2024-04-09', descriptionEvent: 'Araw ng Kagitingan (Day of Valor)' },
        { dateEvent: '2024-06-12', descriptionEvent: 'Independence Day' },
        { dateEvent: '2024-08-21', descriptionEvent: 'Ninoy Aquino Day' },
        { dateEvent: '2024-08-26', descriptionEvent: 'National Heroes Day' },
        { dateEvent: '2024-11-30', descriptionEvent: 'Bonifacio Day' },
        { dateEvent: '2024-12-25', descriptionEvent: 'Christmas Day' },
        { dateEvent: '2024-12-30', descriptionEvent: 'Rizal Day' },
        { dateEvent: '2025-01-01', descriptionEvent: 'New Year\'s Day' },
        { dateEvent: '2025-02-25', descriptionEvent: 'EDSA People Power Revolution Anniversary' },
        { dateEvent: '2025-04-09', descriptionEvent: 'Araw ng Kagitingan (Day of Valor)' },
        { dateEvent: '2025-06-12', descriptionEvent: 'Independence Day' },
        { dateEvent: '2025-08-21', descriptionEvent: 'Ninoy Aquino Day' },
        { dateEvent: '2025-08-26', descriptionEvent: 'National Heroes Day' },
        { dateEvent: '2025-11-30', descriptionEvent: 'Bonifacio Day' },
        { dateEvent: '2025-12-25', descriptionEvent: 'Christmas Day' },
        { dateEvent: '2025-12-30', descriptionEvent: 'Rizal Day' },
    ];
    
    const onDayPress = (day) => {
        const selectedDate = day.dateString;
        setSelectedDateCalendar(selectedDate);
    
        const schedule = schedules.find(schedule => schedule.date === selectedDate);
        
        if (schedule) {
            setSelectedSchedule(schedule);
            return;
        }
    
        const philippineEvent = philippineEvents.find(event => event.dateEvent === selectedDate);
    
        setSelectedSchedule(philippineEvent ? { ...philippineEvent, time: null } : null);
    };     
    
    const onShowCalendar = () => {
        setShowCalendar(false); 
        setTimeout(() => setShowCalendar(true), 0); 
    };

    const markedDates = schedules.reduce((acc, schedule) => {
        acc[schedule.date] = {
            selected: true,
            marked: true,
            selectedDayBackgroundColor: '#4CAF50',
            description: schedule.description,
            time: schedule.time || '',
        };
        return acc;
    }, {});
    
    philippineEvents.forEach(event => {
        if (!markedDates[event.dateEvent]) {
            markedDates[event.dateEvent] = {
                marked: true,
                dotColor: '#FF5733',
                descriptionEvent: event.descriptionEvent,
            };
        }
    });
    
    const handleArrowClick = (schedule) => {
        navigation.navigate('Scheduler', { scheduleToEdit: schedule });
    };

    const handleDelete = (scheduleId) => {
        setSchedules((prevSchedules) => prevSchedules.filter(schedule => schedule.id !== scheduleId));
    };
    
    const SwipeableItem = ({ schedule, handleDelete }) => {
        const translateX = useSharedValue(0);
        const SWIPE_THRESHOLD = 50;
        const MAX_SWIPE = 150;
    
        const panGesture = Gesture.Pan()
            .onUpdate((event) => {
                translateX.value = Math.min(Math.max(0, event.translationX), MAX_SWIPE);
            })
            .onEnd(() => {
                if (translateX.value > SWIPE_THRESHOLD) {
                    translateX.value = withSpring(MAX_SWIPE);
                } else {
                    translateX.value = withSpring(0);
                }
            });
    
        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateX: -translateX.value }],
        }));
    
        const calculateFontSize = (text) => {
            if (text.length <= 40) {
                return 14; 
            } else if (text.length <= 80) {
                return 11; 
            } else {
                return 9; 
            }
        };
    
        return (
            <View style={styles.swipeableContainer}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.swipeableItem, animatedStyle]}>
                        {/* Schedule Item */}
                        <View style={styles.scheduleItem}>
                            <View style={styles.descriptionRow}>
                                <Text
                                    style={[
                                        styles.productDescriptionText,
                                        { fontSize: calculateFontSize(schedule.description) },
                                    ]}
                                >
                                    {schedule.description}
                                </Text>
    
                                <TouchableOpacity onPress={() => handleArrowClick(schedule)}>
                                    <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
    
                            <View style={styles.detailLine} />
                            <View style={styles.dateTimeRow}>
                                <Text style={styles.details}>{format(new Date(schedule.date), 'MMMM dd, yyyy')}</Text>
                                <Text style={styles.details}>{schedule.time && schedule.time !== 'N/A' ? schedule.time : ''}</Text>
                            </View>
                        </View>
    
                        {/* Delete Button (appears after swipe) */}
                        <Animated.View style={[styles.deleteButton]}>
                            <TouchableOpacity onPress={() => handleDelete(schedule.id)}>
                                <MaterialIcons name="delete" size={24} color="white" />
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                </GestureDetector>
            </View>
        );
    };

    const today = new Date(); 
    const formattedDate = format(today, 'EEEE!, MMMM dd, yyyy');
    
    return (
        <ScrollView style={styles.container} scrollEventThrottle={16}>
            <StatusBar hidden={false} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerTitleText}>Hello, Jojo!</Text>
                </View>
                <View style={styles.headerGreet}>
                    <Text style={styles.headerTitleText}>Today is {formattedDate}</Text>
                </View>
            </View>

            {/* Carousel Section */}
            <View style={styles.carouselSection}>

                <View style={styles.titleContainer}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>Planting Calendar</Text>
                    </View>
                    <View style={styles.title}>
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

                {/* Schedule Container */}
                <View style={styles.scheduleContainer}>
                    <Text style={styles.scheduleText}>Your Schedule</Text>

                    {schedules.length > 0 ? (
                        schedules.map((schedule) => (
                            <SwipeableItem key={schedule.id} schedule={schedule} handleDelete={handleDelete} />
                        ))
                    ) : (
                        <View style={styles.noSchedulesContainer}>
                            <Text style={styles.noSchedulesText}>No schedules available.</Text>
                        </View>
                    )}

                    <View style={styles.line} />
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
                        <Text style={styles.placeholderText}>Calendar will appear here.</Text>
                        ) : (
                            <Calendar
                                current={`${year}-${monthNumbers[month]}-01`}
                                minDate={'2024-01-01'}
                                maxDate={'3000-12-31'}
                                onDayPress={onDayPress}
                                markedDates={markedDates}
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
                                    textDayFontSize: 11,
                                    textMonthFontSize: 12,
                                    textDayHeaderFontSize: 12,
                                    dotColor: 'transparent', 
                                    selectedDotColor: 'transparent',
                                    'stylesheet.day.basic': { 
                                        base: {
                                            marginBottom: -10,
                                            borderRadius: 25,             
                                            width: 20,                   
                                            height: 20,       
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        },
                                    },
                                    
                                    
                                }}
                            />

                        )}
                    </View>

                    <View style={styles.placeholderResult}>
                        {showCalendar && selectedSchedule ? (
                            <View style={styles.wrapperScheduleCalendar}>
                                {selectedSchedule.descriptionEvent ? null : (
                                    <View style={styles.rowSelectedDate}>
                                        <Text style={styles.selectedDateCalendar}>You have selected date for the schedule. Please review it.</Text>
                                    </View>
                                )}
                                <View style={styles.rowScheduleDetails}>
                                    {selectedSchedule.descriptionEvent ? null : (
                                        <>
                                            <Icon name="bell" size={18} color="#4CAF50" />
                                            <Text style={styles.scheduleDetails}>
                                                {format(new Date(selectedSchedule.date), 'EEEE, MMMM dd, yyyy')}
                                            </Text>
                                        </>
                                    )}
                                    {/* Display schedule time if available */}
                                    {selectedSchedule.time && !selectedSchedule.descriptionEvent && (
                                        <Text style={styles.scheduleDetails}>
                                            {`   ${selectedSchedule.time}`}
                                        </Text>
                                    )}
                                    {/* Display event description for events */}
                                    {selectedSchedule.descriptionEvent && (
                                    <Text style={styles.scheduleEventDetails}>
                                            This date is marked for event: 
                                            <Text style={styles.scheduleEventName}> {selectedSchedule.descriptionEvent}</Text>
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.rowPlaceholder}>
                                <Text style={styles.placeholderScheduleText}>
                                    No schedule or event selected for this date.
                                </Text>
                            </View>
                        )}
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
        paddingVertical: 10,
        paddingHorizontal: 20,      
        alignItems: 'flex-start',  
    },  
    scheduleText: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    noSchedulesContainer: {
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
    },
    noSchedulesText: {
        fontSize: 14, 
        color: 'black',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center', 
    },
    swipeableContainer: {
        marginBottom: 10,
        overflow: 'hidden', 
    },
    swipeableItem: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    scheduleItem: {
        backgroundColor: '#4CAF50', 
        padding: 20,
        borderRadius: 10,
        flex: 1,
    },
    descriptionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    productDescriptionText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    detailLine: {
        marginVertical: 10,
        width: '100%',
        height: 3,
        backgroundColor: 'white',
    },
    dateTimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    details: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'Poppins-Medium',
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: -60, 
        width: 60,
        height: '100%',
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        zIndex: 2,
    },
    line: {
        marginTop: 10,
        borderBottomWidth: 5,
        borderColor: '#4CAF50',
        borderRadius: 5,
        width: '100%',
        marginVertical: 10,
    },
    calendarContainer: {
        padding: 20,
    },
    titleCalendar: {  
        marginBottom: 10,
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
        height: 'auto',
        minHeight: 300, 
    },
    placeholderResult: {
        backgroundColor: '#D9D9D9',  
        padding: 10,
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        marginTop: 10,
        height: 100,
    },
    wrapperScheduleCalendar: {
        margin: 5,
    },
    rowSelectedDate: {
        alignItems: 'center',
        paddingVertical: 5,
    },
    selectedDateCalendar: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
        color: '#000',
    },
    rowScheduleDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    scheduleDetails: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#585858',
    },
    scheduleEventDetails: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#000',
    },
    scheduleEventName: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#4CAF50',
    },
    scheduleLabel: {
        fontFamily: 'Poppins-Regular',
        color: '#000',
    },
    rowPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center', 
        paddingVertical: 10,
    },
    placeholderScheduleText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#585858',
    },
    placeholderText: { 
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#585858',
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
    selectedDate: {
        color: '#585858',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    
});

export default CalendarScreen;
