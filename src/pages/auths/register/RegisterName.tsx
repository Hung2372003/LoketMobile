import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../../component/login/AuthInput';
import styles from '../style';
import Submit from '../../../component/login/Submit';
import ButtonBack from '../../../component/login/ButtonBack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import storage from '../../../api/storage';
import authService from '../../../services/authService';

type RegisterNameRouteProps = RouteProp<RootStackParamList, 'RegisterName'>;
interface RegisterNameProps {
  navigation: any;
}

const RegisterName: React.FC<RegisterNameProps> = ({navigation}) => {

  const [name, setName] = useState('');
  const route = useRoute<RegisterNameRouteProps>();
  const [identifier, setIdentifier] = useState('');
  const [password, setpassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      // Lấy email hoặc phone từ route params
      const { email, password } = route.params;
      setIdentifier(email);
      setpassword(password);
    }, [route.params]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { token, userId } = await authService.register(identifier, password, name);

      await storage.storeTokens(token);
      await storage.storeUserId(userId);

      Alert.alert("Chào mừng "+ name);
      navigation.navigate('MainScreen');

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Đăng kí thất bại. Vui lòng thử lại.';
        Alert.alert('Lỗi', errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      <View style={styles.container}>
          <ButtonBack onBackPage={handleBack} />
          <View style={{flex: 1}} />
          <AuthInput
            value= {name}
            title='Chọn một tên người dùng' 
            keyboardType='default' 
            placeholder='tên người dùng'
            onChangeText={setName}
          />
          <View style={{flex: 1}} />
          <Submit
            onSubmit={handleRegister}
            disabled={!name || isLoading}
          />

      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffb700" />
        </View>
      )}

    </KeyboardAvoidingView>

  );
};

export default RegisterName;