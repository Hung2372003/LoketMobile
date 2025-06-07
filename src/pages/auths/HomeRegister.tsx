import React from 'react';
import {Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './style';
import { RootStackParamList } from '../../navigation/AppNavigation';
// import { StackScreenProps } from '@react-navigation/stack';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type HomeRegisterProps = NativeStackNavigationProp<RootStackParamList, 'HomeRegister'>;

const HomeRegister: React.FC = () => {

  const navigation = useNavigation<HomeRegisterProps>();

  const handleLogin = () => {
    navigation.navigate('PhoneLogin');
  };

  const handleRegister = () => {
    navigation.navigate('RegisterEmail');
  };

  return (
    <View style={styles.container}>
      <View style={styles.slide}>
        <View style={styles.general}>
          <View style={styles.general_top} />
          <View style={styles.genera_central}>
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
            <View style={styles.block} />
          </View>
          <View style={styles.general_bot}/>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.title}>
          <Image source={require('../../assets/logo_locket.png')} style={styles.logo}/>
          <Text style={{color: '#fff', fontWeight: '900', fontSize: 30}}>Locket</Text>
        </View>
        <Text style={{color: '#b6b7b1', fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>Ảnh trực tiếp từ bạn bè,</Text>
        <Text style={{color: '#b6b7b1', fontWeight: 'bold', fontSize: 20}}>ngay trên màn hình chính</Text>
      </View>
      <View style={styles.regis}>
        <TouchableOpacity
          style={styles.button_register}
          onPress={handleRegister}
        >
          <Text style={{fontSize: 16, fontWeight: 'bold', paddingHorizontal: 5}}>Tạo một tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button_login}
          onPress={handleLogin}
        >
            <Text style={{color: '#b6b7b1',  fontSize: 16, fontWeight: 'bold'}}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeRegister;
