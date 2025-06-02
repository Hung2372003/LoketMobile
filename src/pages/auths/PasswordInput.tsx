import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../component/login/AuthInput';
import styles from './style';
import Option from '../../component/login/Option';
import Submit from '../../component/login/Submit';
import ButtonBack from '../../component/login/ButtonBack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type PasswordInputRouteProps = RouteProp<RootStackParamList, 'PasswordInput'>;
type PasswordInputProps = NativeStackNavigationProp<RootStackParamList, 'PasswordInput'>;

const PasswordInput = () => {

  const [password, setPassword] = useState('');
  const route = useRoute<PasswordInputRouteProps>();
  const navigation = useNavigation<PasswordInputProps>();
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    // Lấy email hoặc phone từ route params
    const { email, phone } = route.params;
    if (email) {
      setIdentifier(email);
    } else if (phone) {
      setIdentifier(phone);
    }
  }, [route.params]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    if (identifier && password) {
      console.log(`Đăng nhập với ${identifier} và mật khẩu: ${password}`);
      Alert.alert(`Đăng nhập thành công với: ${identifier}`);
      navigation.navigate('MainScreen');
    } else {
      Alert.alert('Vui lòng nhập mật khẩu.');
    }
  };

  const handleForgetPassword = () => {
    // navigation.navigate('EmailLogin');
    Alert.alert("Chưa làm!!")
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      <View style={styles.container}>
          <ButtonBack onBackPage={handleBack} />
          <View style={{flex: 1}} />
          <AuthInput
            value= {password}
            title='Điền mật khẩu của bạn' 
            keyboardType='default' 
            placeholder='Mật khẩu' 
            secureTextEntry = {true}
            onChangeText={setPassword}
          />
          <Option 
            title='Bạn đã quên mật khẩu?'
            onChangeMethod={handleForgetPassword}
          />
          <View style={{flex: 1}} />
          <Submit
            onSubmit={handleLogin}
          />
      </View>
    </KeyboardAvoidingView>

  );
};

export default PasswordInput;