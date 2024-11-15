import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Image, StatusBar, RefreshControl, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const { width } = Dimensions.get('window');

const WEATHER_API_KEY = '7f633553bdc1226849069eae66eaa6ef'; 

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const MINDANAO_LOCATIONS = [
    'Cagayan de Oro',
    'Davao City',
    'General Santos',
    'Iligan City',
    'Butuan City',
    'Zamboanga City',
    'Surigao City',
    'Cotabato City',
    'Pagadian City',
    'Dipolog City',
    'Koronadal',
  ];

const WeatherScreeen = ({ route }) => {
    const navigation = useNavigation();
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const [location, setLocation] = useState(MINDANAO_LOCATIONS[0]);
    const [weather, setWeather] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWeather(); 
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

    const fetchWeather = useCallback(async () => {
        if (!location) return Console.log('Error', 'Please select a location.');

        const formattedLocation = `${location}, Philippines`; 
        setLoading(true); 
        console.log(`Fetching weather for: ${formattedLocation}`); 
        try {
            const response = await axios.get(WEATHER_API_URL, {
            params: {
                q: formattedLocation,
                appid: WEATHER_API_KEY,
                units: 'metric', 
            },
            });

            if (response.status === 200) {
            setWeather(response.data);
            checkAlerts(response.data);
            } else {
                console.log('Error', 'Failed to fetch weather data.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error.response?.data || error.message);
            console.log('Error', error.response?.data?.message || 'Failed to fetch weather data.');
        } finally {
            setLoading(false); 
        }
        }, [location]); 

        const checkAlerts = (data) => {
        const { weather, main } = data;
        const alertCondition = weather[0].main; 

        if (alertCondition === 'Rain' || main.temp < 10) {
            console.log(
            'Weather Alert',
            'Heavy rain or cold weather detected. Take necessary precautions!'
            );
        }
    };

    const getTemperatureStatus = (temp) => {
        if (temp < 10 || temp > 30) {
        return 'Bad'; 
        }
        return 'Good'; 
    };
    
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchWeather(); 
        setRefreshing(false);
    };

    const BulletText = ({ text, style, styleThunderstorm }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.guideText, style, styleThunderstorm]}> {text}</Text>
        </View>
        
    );

    const BulletLink = ({ text, url, stylePagasa }) => (
        <TouchableOpacity onPress={() => url && Linking.openURL(url)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.bullet}>• </Text>
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
                <Text style={styles.headerTitleText}>Heads Up, Jojo!</Text>
            </View>
            <View style={styles.headerGreet}>
                <Text style={styles.headerTitleText}>Weather Update Incoming</Text>
            </View>
        </View>

       {/* Weather Container */}
       <View style={styles.weatherContainer}>

            <View style={styles.rowWeather}>
                <Text style={styles.titleWeather}>Farmer's Weather Alerts</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black" />
                </TouchableOpacity>
            </View>

            {/* Display weather details before the Picker */}
            {loading ? (
             <View style={styles.loadingContainer}>
                <ActivityIndicator size={30} color="#4CAF50" />
            </View>
            ) : weather ? (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Weather in {weather.name}</Text>
                <View style={styles.weatherInfo}>
                <Image
                    source={{
                    uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
                    }}
                    style={styles.icon}
                />
                <View style={styles.weatherDetails}>
                    <Text style={styles.label}>Temperature:</Text>
                    <Text style={styles.temperature}>
                    {weather.main.temp} °C - {getTemperatureStatus(weather.main.temp)}
                    </Text>
                    <Text style={styles.condition}>
                    Condition: {weather.weather[0].description}
                    </Text>
                    <Text style={styles.label}>Humidity:</Text>
                    <Text style={styles.humidity}>{weather.main.humidity}%</Text>
                    <Text style={styles.label}>Wind Speed:</Text>
                    <Text style={styles.windSpeed}>{weather.wind.speed} m/s</Text>
                </View>
                </View>
            </View>
            ) : null}

            {/* Move the Picker below the weather details */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={location}
                    onValueChange={(itemValue) => {
                    setLocation(itemValue);
                    fetchWeather(); 
                    }}
                    style={styles.picker}
                >
                    {MINDANAO_LOCATIONS.map((loc) => (
                    <Picker.Item key={loc} label={loc} value={loc} />
                    ))}
                </Picker>
            </View>


        </View>

        {/* Weather Condition Guide Container */}
        <View style={styles.weatherGuideContainer}>
            <View style={styles.rowWeather}>
                <Text style={styles.titleWeather}>Weather Condition Guide</Text>
                <TouchableOpacity onPress={() => setShowInfoMessage((prev) => !prev)}>
                    <AntDesign name="questioncircleo" size={14} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.guideContainer}>
                <View style={styles.temperatureWrapper}>
                    <Text style={styles.titleGuide}>Temperature</Text>
                    <Text style={[styles.guideText, { fontSize: 12}]}>Good Measurement: Range: 15°C to 30°C</Text>
                    <Text style={[styles.guideText, { fontSize: 12}]}>Bad Measurement: Below 10°C or Above 30°C</Text>
                </View>

                <View style={styles.conditionWrapper}>
                    <Text style={styles.titleGuide}>Condition</Text>
                    <Text style={styles.titleCondition}>Clear Sky:</Text>
                    <BulletText text="No clouds, full sunshine." />
                    <Text style={styles.titleCondition}>Few Clouds:</Text>
                    <BulletText text="Generally good weather."/>
                    <Text style={styles.titleCondition}>Scattered Clouds:</Text>
                    <BulletText text="Good growing conditions."/>
                    <Text style={styles.titleCondition}>Overcast Clouds:</Text>
                    <BulletText text="Reduced sunlight: may affect photosynthesis." style={{ fontSize: 13}}/>
                    <Text style={styles.titleCondition}>Light Rain:</Text>
                    <BulletText text="Generally beneficial for crops"/>
                    <Text style={styles.titleCondition}>Rain:</Text>
                    <BulletText text="Good for crops if not excessive."/>
                    <Text style={styles.titleCondition}>Thunderstorm:</Text>
                    <BulletText text="Potential damage from strong winds and heavy rain." styleThunderstorm={{ fontSize: 12 }}/>
                    <Text style={styles.titleCondition}>Mist:</Text>
                    <BulletText text="Can affect field activities."/>
                    <Text style={styles.titleCondition}>Fog:</Text>
                    <BulletText text="Similar to mist."/>
                </View>

                <View style={styles.humidityWrapper}>
                    <Text style={styles.titleGuide}>Humidity</Text>
                    <Text style={[styles.guideText, { fontSize: 12}]}>Good Measurement Range: 40% to 60%</Text>
                    <Text style={[styles.guideText, { fontSize: 12}]}>Bad Measurement Range: Below 30% or Above 72%</Text>
                </View>

                <View style={styles.windSpeedWrapper}>
                    <Text style={styles.titleGuide}>Wind Speed</Text>
                    <Text style={[styles.guideText, { fontSize: 12}]}>Good Measurement Range: 5 km/h to 15 km/h</Text>
                    <Text style={[styles.guideText, { fontSize: 12}]}>Bad Measurement Range: Above 30 km/h</Text>
                </View>
            </View>

            {/*More Information */}
            <View style={styles.informationContainer}>
                <Text style={styles.titleInformation}>For more information?</Text>

                <View style={styles.wrapperInformation}>
                    <Text style={styles.titleGuide}>PAGASA</Text>
                    <BulletLink text="Climate Impact Assessment for Philippines Agriculture: " stylePagasa={{ fontSize: 12 }} url="https://www.pagasa.dost.gov.ph/agri-weather/impact-assessment-for-agriculture?form=MG0AV3"/>
                    <Text style={styles.titleGuide}>World Bank</Text>
                    <BulletLink text="Climate-Resilient Agriculture in the Philippines: " url="https://climateknowledgeportal.worldbank.org/sites/default/files/2021-08/CRA_Profile_Philippines.pdf?form=MG0AV3"/>
                    <Text style={styles.titleGuide}>World Food Programme</Text>
                    <BulletLink text="Climate Change and Food Security Analysis: " url="https://www.wfp.org/news/wfp-study-provides-first-ever-look-links-between-climate-change-and-food-security-philippines?form=MG0AV3"/>
                </View>
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
    weatherContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    rowWeather: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',  
        gap: 5, 
    },
    titleWeather: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
    },
    pickerContainer: {
        marginTop: 20,
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#ccc',
        elevation: 2,
        overflow: 'hidden', 
    },
    picker: {
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent', 
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 220,
    },    
    card: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 2, 
        height: 220,
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherDetails: {
        marginLeft: 20,
    },
    temperature: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#2196F3',
    },
    condition: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginVertical: 5,
        color: '#828282',
    },
    label: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    humidity: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#FFEB3B',
    },
    windSpeed: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#FFEB3B',
    },
    icon: {
        width: 100,
        height: 100,
    },
    weatherGuideContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    guideContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    temperatureWrapper: {
        padding: 10,
    },
    conditionWrapper: {
        padding: 10,
    },
    humidityWrapper: {
        padding: 10,
    },
    windSpeedWrapper: {
        padding: 10,
    },
    titleGuide: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    titleCondition: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
    },
    guideText: {
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    bullet: {
        color: 'black',
        fontFamily: 'Poppins-Regular',
    },
    linkText: {
        color: '#2196F3',
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-Regular',
    },
    informationContainer: {
        paddingVertical: 30,
    },  
    titleInformation: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
    },
    wrapperInformation: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 2, 
    },

    
});


export default WeatherScreeen;
