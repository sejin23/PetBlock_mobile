import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Ubuntu_500Medium } from '@expo-google-fonts/ubuntu';
import AppNavigator from './src/navigations/AppNavigator';
import Reducers from './src/reducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { AppLoading } from 'expo';

const store = createStore(Reducers, applyMiddleware(ReduxThunk));

export default function App() {
  let [ fontsLoaded ] = useFonts({
      Ubuntu_500Medium,
  })
  if(!fontsLoaded) return <AppLoading />
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}