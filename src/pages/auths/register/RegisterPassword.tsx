import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../../component/login/AuthInput';
import styles from '../style';
import Submit from '../../../component/login/Submit';
import ButtonBack from '../../../component/login/ButtonBack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type RegisterPasswordRouteProps = RouteProp<RootStackParamList, 'RegisterPassword'>;
type RegisterPasswordProps = NativeStackNavigationProp<RootStackParamList, 'RegisterPassword'>;

const RegisterPassword = () => {

  const [password, setPassword] = useState('');
  const route = useRoute<RegisterPasswordRouteProps>();
  const navigation = useNavigation<RegisterPasswordProps>();
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    // Lấy email hoặc phone từ route params
    const { email} = route.params;
    setIdentifier(email);
  }, [route.params]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRegister = () => {
    if (identifier && password) {
      // console.log(`Đăng nhập với ${identifier} và mật khẩu: ${password}`);
      // Alert.alert(`Đăng nhập thành công với: ${identifier}`);
      navigation.navigate('MainScreen');
    } else {
      Alert.alert('Vui lòng nhập mật khẩu.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      <View style={styles.container}>
          <ButtonBack onBackPage={handleBack} />
          <View style={{flex: 1}} />
          <AuthInput
            value= {password}
            title='Chọn một mật khẩu' 
            keyboardType='default' 
            placeholder='Mật khẩu' 
            secureTextEntry = {true}
            onChangeText={setPassword}
          />
          <View style={{flex: 1}} />
          <Submit
            onSubmit={handleRegister}
            disabled={!password}
          />
      </View>
    </KeyboardAvoidingView>

  );
};

export default RegisterPassword;