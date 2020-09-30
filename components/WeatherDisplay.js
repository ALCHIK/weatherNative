import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

const WeatherDisplay = ({zip}) => {
  const initData = {
    weatherData: {},
    error: '',
    isLoading: true,
    hasHistory: false,
  };

  const [weatherData, setWeatherData] = useState(initData.weatherData);
  const [error, setError] = useState(initData.error);
  const [isLoading, setIsLoading] = useState(initData.isLoading);
  const [startDate, setStartDate] = useState(new Date());
  const [hasHistory, setHistory] = useState(initData.hasHistory);

  const URL = 'https://www.metaweather.com/api/location/' + zip + '/';
  const imageURL = 'https://www.metaweather.com/static/img/weather/png/64/';

  const getListWeather = () => {
    setHistory(false);
    setIsLoading(true);
    return fetch(URL, {method: 'GET'})
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setWeatherData(response);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const onClickDateHandler = (date) => {
    setIsLoading(true);
    setWeatherData({});
    setStartDate(date);
    const [year, month, day] = date.split('-');
    fetch(URL + year + '/' + month + '/' + day + '/', {method: 'GET'})
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setWeatherData({consolidated_weather: response});
        setIsLoading(false);
        setHistory(true);
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    getListWeather();
  }, []);

  useEffect(() => {
    console.log('update');
  });

  useEffect(() => {
    return () => {
      console.log('will unmount');
    };
  }, []);

  const FlatListItemSeparator = () => {
    return (
      <View style={{height: 1, width: '100%', backgroundColor: '#607D8B'}} />
    );
  };

  const WeatherList = () => {
    return (
      <SafeAreaView>
        <FlatList
          data={weatherData.consolidated_weather}
          ItemSeparatorComponent={FlatListItemSeparator}
          renderItem={({item}) =>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={styles.container}>
                <Image
                  style={styles.tinyLogo}
                  source={{uri: imageURL + item.weather_state_abbr + '.png'}}
                />
                <Text style={styles.container__text}>
                  {!hasHistory ? item.applicable_date : item.created}
                </Text>
                <Text style={styles.container__text}>
                  Max: {item.max_temp.toFixed()}°
                </Text>
                <Text style={styles.container__text}>
                  Min: {item.min_temp.toFixed()}°
                </Text>
                <Text style={styles.container__text}>
                  Wind Speed: {item.wind_speed.toFixed()} mi/hr
                </Text>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index}
        />
      </SafeAreaView>
    );
  };

  return (
    <View>
      <Text style={styles.container__text}>Weather in Moscow!</Text>
      <DatePicker
        style={{width: 200}}
        date={startDate}
        mode="date"
        placeholder="selected date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
        }}
        onDateChange={(date) => {
          onClickDateHandler(date);
        }}
      />
      {hasHistory ?
        <View>
          <Button
            title="home page"
            onPress={() => {
              getListWeather();
            }}>
            <Text>Home</Text>
          </Button>
          <WeatherList />
        </View> : <Text></Text>}
      {
      isLoading ? <Text>Loading...</Text>:
      !isLoading && error ?
        <Text>{error}</Text> :
        <WeatherList />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container__text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export {WeatherDisplay};
