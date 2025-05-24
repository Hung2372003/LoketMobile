import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../component/login/AuthInput';
import styles from './style';
import Option from '../../component/login/Option';
import Submit from '../../component/login/Submit';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigation';
import { useNavigation } from '@react-navigation/native';
import ButtonBack from '../../component/login/ButtonBack';

type EmailLoginProps = NativeStackNavigationProp<RootStackParamList, 'EmailLogin'>;

const EmailLogin = () => {

  const [email, setEmail] = useState('');
  const navigation = useNavigation<EmailLoginProps>();

  const handleBack = () => {
    navigation.navigate('HomeRegister');
  };

  const handleNext = () => {
    if (email) {
      navigation.navigate('PasswordInput', { email: email }); // Truyền phone
    } else {
      Alert.alert('Vui lòng nhập số điện thoại.');
    }
  };

  const handlePhoneLogin = () => {
    navigation.navigate('PhoneLogin');
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      <View style={styles.container}>
          <ButtonBack onBackPage={handleBack} />
          <View style={{flex: 1}} />
          <AuthInput
              value={email}
              title='Email của bạn là gì?' 
              keyboardType='email-address' 
              placeholder='Địa chỉ email' 
              onChangeText={setEmail}
          />
          <Option 
              title='Sử dụng số điện thoại thay cho cách này'
              onChangeMethod={handlePhoneLogin}
          />
          <View style={{flex: 1}} />
          <Submit
            onSubmit={handleNext}
          />
      </View>
    </KeyboardAvoidingView>

  );
};

export default EmailLogin