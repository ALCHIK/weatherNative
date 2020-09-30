/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View} from 'react-native';

import {WeatherDisplay} from './components/WeatherDisplay';

const Cities = [
  {
    name: 'Moscow',
    zip: '2122265',
    id: 1,
  },
];

const App = () => {
  const initData = {
    activePlace: 0,
    weatherData: null,
  };

  const [activePlace, setActivePlace] = useState(initData.activePlace);

  useEffect(() => {
    console.log('update');
  });

  useEffect(() => {
    console.log('did mount');
  }, []);

  useEffect(() => {
    return () => {
      console.log('will unmount');
    };
  }, []);

  return (
    <View>
      <WeatherDisplay zip={Cities[activePlace].zip} />
    </View>
  );
};

export default App;
