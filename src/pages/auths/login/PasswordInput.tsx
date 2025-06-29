import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../../component/login/AuthInput';
import styles from '../style';
import Option from '../../../component/login/Option';
import Submit from '../../../component/login/Submit';
import ButtonBack from '../../../component/login/ButtonBack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import authService from '../../../services/authService';
import storage from '../../../api/storage'

type PasswordInputRouteProps = RouteProp<RootStackParamList, 'PasswordInput'>;

interface PasswordInputProps {
  navigation: any; // Replace with proper navigation type
}

const PasswordInput: React.FC<PasswordInputProps> = ({ navigation }) => {

  const [password, setPassword] = useState('');
  const route = useRoute<PasswordInputRouteProps>();
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

  const handleLogin = async () => {
    try {
      const { token, userId ,title } = await authService.login(identifier, password);

      await storage.storeTokens(token);
      await storage.storeUserId(userId);

      Alert.alert(title);
      navigation.navigate('MainScreen');

    } catch (error) {
      Alert.alert('Đăng nhập thất bại');
    }
  };

  const handleForgetPassword = () => {

    Alert.alert("Chưa làm!!")
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      <View 
        style={styles.container}
      >
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
            disabled={!password}
          />
      </View>
    </KeyboardAvoidingView>

  );
};

export default PasswordInput;