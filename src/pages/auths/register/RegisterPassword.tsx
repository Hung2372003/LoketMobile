import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../../component/login/AuthInput';
import styles from '../style';
import Submit from '../../../component/login/Submit';
import ButtonBack from '../../../component/login/ButtonBack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';

type RegisterPasswordRouteProps = RouteProp<RootStackParamList, 'RegisterPassword'>;
interface RegisterPasswordProps {
  navigation: any;
}

const RegisterPassword: React.FC<RegisterPasswordProps> = ({navigation}) => {

  const [password, setPassword] = useState('');
  const route = useRoute<RegisterPasswordRouteProps>();
  const { email } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRegisterName = () => {
    if (email && password) {
      navigation.navigate('RegisterName', { email: email, password: password});
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
            onSubmit={handleRegisterName}
            disabled={!password}
          />
      </View>
    </KeyboardAvoidingView>

  );
};

export default RegisterPassword;