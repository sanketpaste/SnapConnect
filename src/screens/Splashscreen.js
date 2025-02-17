import React, { useEffect } from 'react';
import { View, Text,StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    
    const timer = setTimeout(() => {
      navigation.navigate('MainScreen');
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text,{color:'#6C6C6C',fontWeight:'700'}]}>Daily</Text>
      
      <Text style={[styles.text,{color:'#00E3BA',fontWeight:'700'}]}>Snaps</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row'
  },
  text: {
    fontSize: 28,
    fontFamily:'Inter'
    
  },
});

export default SplashScreen;




