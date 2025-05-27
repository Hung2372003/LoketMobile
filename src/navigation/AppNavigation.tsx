import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneLogin from '../pages/auths/PhoneLogin';
import EmailLogin from '../pages/auths/EmailLogin';
import PasswordInput from '../pages/auths/PasswordInput';
import HomeRegister from '../pages/auths/HomeRegister';
import ProfileScreen from "../pages/about/ProfileScreen.tsx";

export type RootStackParamList = {
  HomeRegister: undefined;
  PhoneLogin: undefined;
  EmailLogin: undefined;
  PasswordInput: { email?: string, phone?: string };
  ProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="HomeRegister" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeRegister" component={HomeRegister} />
      <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
      <Stack.Screen name="EmailLogin" component={EmailLogin} />
      <Stack.Screen name="PasswordInput" component={PasswordInput} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigation;