import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, StatusBar, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo';

export default class HomeScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            debug: false,
            listCity: [
                { 
                    name: "London",
                    country: "UK"
                },
                { name: "Edinburgh",
                    country: "UK"
                },
                { name: "New York",
                    country: "US"
                },
                { name: "Texas",
                    country: "US"
                },
                { name: "Washington",
                    country: "US"
                },
                { name: "Paris",
                    country: "France"
                },
                { name: "Doha",
                    country: "Qatar"
                },
                { name: "Sydney",
                    country: "Australia"
                },
                { name: "Cancun",
                    country: "Mexico"
                },
                { name: "Madrid",
                    country: "Spain"
                },
                { name: "Berlin",
                    country: "Germany"
                },
                { name: "Brussels",
                    country: "Belgium"
                },
                { name: "Copenhagen",
                    country: "Denmark"
                },
                { name: "Athens",
                    country: "Greece"
                },
                { name: "New Delhi",
                    country: "India"
                },
                { name: "Dublin",
                    country: "Ireland"
                },
                { name: "Rome",
                    country: "Italy"
                },
                { name: "Tokyo",
                    country: "Japan"
                },
                { name: "Wellington",
                    country: "New Zealand"
                },
                { name: "Amsterdam",
                    country: "Netherlands"
                },
                { name: "Oslo",
                    country: "Norway"
                },
                { name: "Panama City",
                    country: "Panama"
                },
                { name: "Lisbon",
                    country: "Portugal"
                },
                { name: "Warsaw",
                    country: "Poland"
                },
                { name: "Moscow",
                    country: "Russia"
                }
            ],
            list: [],
            refresh: false,
            showAlert: false,
            alertMsg: ''
        }

        this.debug('APP START');
        
    }

    componentDidMount(){
        this.fetchListCityWeather();
    }

    debug = (obj, str = '') => {
        if(this.state.debug)
            console.log('DEBUG:', str, obj);
    }

    getRandomCity = (arr, n) => {
        let result = [], len = arr.length, taken = [];
        for(i = 0; i < n; i++){
            let r = 0;
            do{
                r = Math.floor(Math.random() * len);
            }while(taken.includes(r))
            result[i] = arr[r];
            taken[i] = r; 
        }
        return result;
    }

    fetchListCityWeather = () => {
        
        let list = this.getRandomCity(this.state.listCity, 7);
        this.debug(list);
        
        list.forEach(async (city) => {
                this.fetchCityWeather(city.name, city.country);
            }
        );

        
    }

    fetchCityWeather = async (city, country) => {
        try{
            let uri = 'https://api.openweathermap.org/data/2.5/weather?q='+city+','+country+'&appid=13d1b3f81d780058dfec91a5d74a8180&units=metric';
            this.debug(uri);

            let response = await fetch(uri);
            let responseJson = await response.json();
            this.debug(responseJson);

            let main = responseJson.main;
            let cityWeather = {
                name: responseJson.name,
                country: country,
                temp: Math.round(main.temp),
                type: responseJson.weather[0].main,
                desc: 'Humidity: ' + main.humidity + '% - ' + responseJson.weather[0].main 
            }
            this.debug(cityWeather);

            this.setState((preState) => {
                let newList = preState.list.map(x => x);
                newList.push(cityWeather);
                return({
                    list: newList,
                    refresh: false
                });
                
            });

            this.debug(this.state.list, 'list city weather - STATE: ');

        }catch(err)
        {
            console.log(err);    
        }
    }

    getTempRange = (t) => {
        if(t <= 10)
            return 1; //cold

        if(t > 10 && t <= 25)
            return 2; //warm
        
        if(t > 25 && t <= 35)
            return 3; //hot

        if(t > 35)
            return 4; //very hot
    }

    getEmoji = (type) => {
        let emoji = '';
        switch(type){
            case 'Clouds': 
                emoji = '☁️';
                break;
            case 'Clear':
                emoji = '☀️';
                break;
            case 'Haze':
                emoji = '🌤';
                break;
            case 'Thunderstorm':
                emoji = '⛈️';
                break;
            case 'Rain':
                emoji = '🌧️';
                break;
            case 'Snow':
                emoji = '❄️';
                break;
            case 'Mist':
                emoji = '☁️';
                break;
            default:
                emoji = '🌡️';
        }
        return emoji;
    }

   

    _onPressAlertClose = () => {
        this.setState({
            showAlert: false,
            alertMsg: ''
        });
    }

    _renderItem = ({item, index}) => {
        return(
          
                <TouchableHighlight
                    underlayColor='white'
                    onPress={() => this.setState({showAlert: true, alertMsg: item.desc})}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                        start={[0.5, 0]}
                    >
                        <View style={styles.row}>
                            <Text style={[
                                (this.getTempRange(item.temp)) === 1 ? styles.cold : styles.textTemp,
                                (this.getTempRange(item.temp)) === 2 ? styles.warm : styles.textTemp,
                                (this.getTempRange(item.temp)) === 3 ? styles.hot : styles.textTemp,
                                (this.getTempRange(item.temp)) === 4 ? styles.veryHot : styles.textTemp,
                                styles.textTemp]}>{this.getEmoji(item.type)} {item.temp}°C</Text>
                            <Text style={styles.textCity}>{item.name}</Text>
                        </View>
                    </LinearGradient>
                </TouchableHighlight>

                
        );
    }

    _onRefresh = () => {
        //Alert.alert('_onRefresh');
        this.setState({
            refresh: true,
            list: []
        });

        this.fetchListCityWeather();


    }

    render(){
        return(
            <View style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>
                <Text style={styles.title}>☀️City Weather</Text>
                <FlatList
                    style={{width: '100%'}}
                    data={this.state.list}
                    renderItem={this._renderItem}
                    keyExtractor={ (item, index) => index.toString() }
                    refreshing={this.state.refresh}
                    onRefresh={this._onRefresh}
                />

                {
                    this.state.showAlert === true ? 
                    (
                        <View style={{position: 'absolute', top: 0, left: 0, flex: 1, 
                                        justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', 
                                        backgroundColor: 'rgba(0,0,0,0.5)'}}>
                            <LinearGradient
                                style={{borderRadius: 8, height: '20%', width: '85%', alignItems: 'center',justifyContent: 'space-between'}}
                                colors={['#e66465', '#9198e5']} 
                                start={[0.5, 0]}
                            >
                                
                                    <Text style={{margin: 20, color: 'white', fontFamily: 'Avenir', fontSize: 20, fontWeight: 'bold'}}>{this.state.alertMsg}</Text>
                                    <TouchableHighlight
                                        
                                        underlayColor='white'
                                        onPress={ this._onPressAlertClose }
                                    >
                                        <Text style={{margin: 20, color: 'white', fontFamily: 'Avenir', fontSize: 14, fontWeight: 'bold'}}>Close</Text>
                                    </TouchableHighlight>
                                
                            </LinearGradient>
                        </View>
                    ) : (<View/>)
                }
            </View>
        );
    }
}

//apikey: 13d1b3f81d780058dfec91a5d74a8180
//https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=13d1b3f81d780058dfec91a5d74a8180&units=metric

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    title: {
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
        paddingTop: 40,
        paddingBottom: 15
    },
    row:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingVertical: 25,
        paddingHorizontal: 15
    },
    textTemp:{
        fontSize: 30,
        fontFamily: 'Avenir',
        lineHeight: 40,
        width: 130,
        fontWeight: 'bold',
        marginRight: 15
    },
    textCity:{
        fontSize: 20,
        fontFamily: 'Avenir',
        lineHeight: 40,
    },
    cold: {
        color: 'blue'
    },
    warm: {
        color: 'green'
    },
    hot: {
        color: 'orange'
    },
    veryHot: {
        color: 'red'
    },

});

