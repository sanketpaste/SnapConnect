import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const CustomTabButton = ({ children, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <View style={{
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#fff',
      justifyContent:'center',
      alignItems:'center',
      elevation: 2
    }}>
      {children}
    </View>
  </TouchableOpacity>
);

export default CustomTabButton;