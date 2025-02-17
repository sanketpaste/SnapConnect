import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Header = () => {
  return (
 
      <View style={styles.container}>
      <Text style={[styles.text, { color: '#6C6C6C', fontWeight: '700' }]}>Daily</Text>
      
      <Text style={[styles.text, { color: '#00E3BA', fontWeight: '700' }]}>Snaps</Text>
    </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
    height:70
  },
  text: {
    fontSize: 26,
    fontFamily: 'Inter',
  },
});

export default Header;