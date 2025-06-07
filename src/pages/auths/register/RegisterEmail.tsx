import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../../component/login/AuthInput';
import styles from '../style';
import Submit from '../../../component/login/Submit';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import { useNavigation } from '@react-navigation/native';
import ButtonBack from '../../../component/login/ButtonBack';

type RegisterEmailProps = NativeStackNavigationProp<RootStackParamList, 'RegisterEmail'>;

const RegisterEmail = () => {

  const [email, setEmail] = useState('');
  const navigation = useNavigation<RegisterEmailProps>();

  const handleBack = () => {
    navigation.navigate('HomeRegister');
  };

  const handleNext = () => {
    if (email) {
      navigation.navigate('RegisterPassword', { email: email }); // Truyền email
    } else {
      Alert.alert('Vui lòng nhập email.');
    }
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
          <View style={{flex: 1}} />
          <Submit
            onSubmit={handleNext}
            disabled={!email}
          />
      </View>
    </KeyboardAvoidingView>

  );
};

export default RegisterEmail