import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../../component/login/AuthInput';
import styles from '../style';
import Option from '../../../component/login/Option';
import Submit from '../../../component/login/Submit';
import ButtonBack from '../../../component/login/ButtonBack';


interface PhoneLoginProps {
  navigation: any; // Replace with proper navigation type
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ navigation }) => {

  const [phone, setPhone] = useState('');

  const handleBack = () => {
    navigation.navigate('HomeRegister');
  };

  const handleNext = () => {
    if (phone) {
      navigation.navigate('PasswordInput', { phone: phone }); // Truyền phone
    } else {
      Alert.alert('Vui lòng nhập số điện thoại.');
    }
  };

  const handleEmailLogin = () => {
    navigation.navigate('EmailLogin');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>

          <ButtonBack onBackPage={handleBack} />
          <View style={{flex: 1}} />
          <AuthInput
            value={phone}
            title='Số điện thoại của bạn là gì?' 
            keyboardType='phone-pad' 
            placeholder='+84 912 345 678' 
            onChangeText={setPhone}
          />
          <Option
            title='Sử dụng email thay cho cách này'
            onChangeMethod={handleEmailLogin}
          />
          <View style={{flex: 1}} />
          <Submit
            onSubmit={handleNext}
            disabled={!phone}
          />

    </KeyboardAvoidingView>

  );
};

export default PhoneLogin;