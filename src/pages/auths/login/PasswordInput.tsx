import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, View } from 'react-native';
import AuthInput from '../../../component/login/AuthInput';
import styles from '../style';
import Option from '../../../component/login/Option';
import Submit from '../../../component/login/Submit';
import ButtonBack from '../../../component/login/ButtonBack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import authService from '../../../services/authService';
import storage from '../../../api/storage';
import { connectToChatHub, joinGroup } from '../../../services/signalR.service';
import { chatManagementApi } from '../../../api/endpoint.api';
import { FirebasePushService } from '../../../services/FirebasePushService';
const pushService = new FirebasePushService();
type PasswordInputRouteProps = RouteProp<RootStackParamList, 'PasswordInput'>;

interface PasswordInputProps {
  navigation: any; // Replace with proper navigation type
}

const PasswordInput: React.FC<PasswordInputProps> = ({ navigation }) => {

  const [password, setPassword] = useState('');
  const route = useRoute<PasswordInputRouteProps>();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading) {return;}

    setIsLoading(true);
    try {
      const { token, userId } = await authService.login(identifier, password);

      await storage.storeTokens(token);
      await storage.storeUserId(userId);
      // await connectToChatHub();
      // await joinGroup('user_' + userId.toString());
      // let listFriend = await chatManagementApi.getListFriend();
      // let listGroupChatId = await chatManagementApi.getAllGroupChatId();
      // listGroupChatId.object?.forEach(async (x)=>{
      //   await joinGroup('groupChat_' + x.groupChatId.toString());
      // });
      // listFriend.forEach(async (x) => {
      //   await joinGroup('user_' + x.userCode.toString());
      // });
      const granted = await pushService.requestPermission();
      if (granted) {
        const token = await pushService.getToken();
        console.log("FCM Token:", token);
        if (token) {
          await pushService.sendTokenToServer(token);
        }
      }
//      Alert.alert(title);
      navigation.navigate('MainScreen');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgetPassword = () => {

    Alert.alert('Chưa làm!!');
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
            title="Điền mật khẩu của bạn"
            keyboardType="default"
            placeholder="Mật khẩu"
            secureTextEntry = {true}
            onChangeText={setPassword}
          />
          <Option
            title="Bạn đã quên mật khẩu?"
            onChangeMethod={handleForgetPassword}
          />
          <View style={{flex: 1}} />

          <Submit
            onSubmit={handleLogin}
            disabled={!password || isLoading}
          />

          <View style={{ height: 50 }} />

      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffb700" />
        </View>
      )}

    </KeyboardAvoidingView>

  );
};

export default PasswordInput;
