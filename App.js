import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './src/screens/Splashscreen';
import MainScreen from './src/screens/MainScreen';
import AddImage from './src/screens/AddImage';
import ImageInfo from './src/screens/ImageInfo';
import UpdateImage from './src/screens/UpdateImage';
import WeatherDetails from './src/screens/WeatherDetails';
import DayImages from './src/screens/DayImages';
import PerDayImages from './src/screens/PerDayImages';
// import ImageDetailsScreen from './src/screens/AddImage';
// import ImageInfo from './src/screens/ImageInfo';
// import LastImage from './src/screens/LastImage';
// import AddImage from './src/screens/AddImage';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" headerMode="none">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddImage"
          component={AddImage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="ImageInfo" component={ImageInfo} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateImage" component={UpdateImage} options={{ headerShown: false }} />
        <Stack.Screen name="WeatherDetails" component={WeatherDetails} options={{ headerShown: false }} />
        <Stack.Screen name="DayImages" component={DayImages} options={{ headerShown: false }} />
        <Stack.Screen name="Day Images" component={PerDayImages}  />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

