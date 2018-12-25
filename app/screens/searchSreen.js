import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableHighlight, Alert, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo';

export default class SearchScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            debug: true,
            searchResult: 0,
            searchInput: '',
            error: 'Search for a city ...',
            item: {}
        };

        this.debug('MY APP > SearchScreen');
    }

    _searchCity = () => {
        this.setState({
            item: {},
            searchResult: 0
        });
        this.fetchCityWeather(this.state.searchInput);
    }

 

    render(){
        return(
            <View style={[styles.container, {justifyContent: 'flex-start'}]}>
                <StatusBar barStyle='light-content'></StatusBar>
                <Text style={styles.title}>☀️City Weather</Text>
                
                <View style={[
                    {alignItems: 'center'}]}>
                    <Text style={{ fontWeight: 'bold', lineHeight: 20, fontSize: 20, marginVertical: 15 }}>Search for city</Text>
                    <TextInput
                        style={{alignItems: 'center', padding: 10, width: '80%', height: 50, lineHeight: 20, fontSize: 20, backgroundColor: 'white', color: 'black', borderRadius: 8, borderColor: 'grey', borderBottomWidth: 2 }}
                        onChangeText={(text) => this.setState({searchInput: text}) }
                        value={this.state.searchInput}
                    >
                    </TextInput>
                    <TouchableHighlight 
                        style={{alignItems: 'center', width: '30%', backgroundColor: 'grey', borderRadius: 8, marginVertical: 15 }}
                        onPress={this._searchCity}
                        underlayColor='white'
                    >
                        <Text style={{lineHeight: 20, fontSize: 14 , padding: 20, color: 'white'}}>Search</Text>
                    </TouchableHighlight>
                </View>
                
                <View style={{alignItems: 'center',justifyContent: 'center'}}>

                    

                    {(this.state.searchResult === 1) ? (
                        <TouchableHighlight
                     
                            underlayColor='white'
                            onPress={ () => Alert.alert(this.state.item.desc) }
                        >
                            <LinearGradient
                                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                                start={[0.5, 0]}
                            >
                                <View style={styles.row}>
                                    <Text style={[
                                        (this.getTempRange(this.state.item.temp)) === 1 ? styles.cold : styles.textTemp,
                                        (this.getTempRange(this.state.item.temp)) === 2 ? styles.warm : styles.textTemp,
                                        (this.getTempRange(this.state.item.temp)) === 3 ? styles.hot : styles.textTemp,
                                        (this.getTempRange(this.state.item.temp)) === 4 ? styles.veryHot : styles.textTemp,
                                        styles.textTemp]}>{this.getEmoji(this.state.item.type)} {this.state.item.temp}°C</Text>
                                    <Text style={styles.textCity}>{this.state.item.name}</Text>
                                </View>
                            </LinearGradient>
                        </TouchableHighlight>
                    ) : (
                        <Text style={styles.textErr}>{this.state.error}</Text>
                    )}
                </View>
            </View>
        );
    }

    debug = (obj, str = '') => {
        if(this.state.debug)
            console.log('DEBUG:', str, obj);
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
        }
        return emoji;
    }

    fetchCityWeather = async (city) => {
        try{
            let uri = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=13d1b3f81d780058dfec91a5d74a8180&units=metric';
            this.debug(uri);

            let response = await fetch(uri);
            let responseJson = await response.json();
            this.debug(responseJson);

            let main = responseJson.main;
            let cityWeather = {
                name: responseJson.name,
                //country: country,
                temp: Math.round(main.temp),
                type: responseJson.weather[0].main,
                desc: 'Humidity: ' + main.humidity + '% - ' + responseJson.weather[0].main 
            }
            this.debug(cityWeather);

            this.setState({
                item: cityWeather,
                searchResult: 1
            });

            this.debug(this.state.item, 'City weather: ');

        }catch(err)
        {
            console.log(err);    
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: 'white'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
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
        paddingHorizontal: 15,
        width: Dimensions.get('window').width // 375
    },
    textTemp:{
        fontSize: 30,
        fontFamily: 'Avenir',
        lineHeight: 40,
        width: 130,
        fontWeight: 'bold',
        marginRight: 15
    },
    textErr:{
        fontSize: 30,
        fontFamily: 'Avenir',
        lineHeight: 40,
        fontWeight: 'bold',
     
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
    textStyling: {
        color: 'red',
        fontFamily: 'Avenir',
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        textDecoration: 'underline',
        textAlign: 'center',
        lineHeight: 1.6,
        //textShadow: {},
        //letterSpacing: 
        //wordSpacing: 
    },
    boxStyling: {
        overflow: 'scroll',
        border: 'dashed', //similar to outline
        margin: 10,
        padding: 10,
        width: 10,
        height: 10,
        //outline: 'dashed', // thick, solid, double
        borderRadius: 8,

        backgroundColor: 'red',
        //linearGradient expo control
        //shadow
        backgroundImage: '',
        backgroundPosition: '',
        backgroundRepeat: '',
        backgroundSize: '',
        backgroundAttachment: ''


        //backgroundClip: '', //adjust background color and background image inside a box

    }
});