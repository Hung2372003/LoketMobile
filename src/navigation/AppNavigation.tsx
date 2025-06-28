import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import PhoneLogin from '../pages/auths/login/PhoneLogin.tsx';
import EmailLogin from '../pages/auths/login/EmailLogin.tsx';
import PasswordInput from '../pages/auths/login/PasswordInput.tsx';
import RegisterEmail from '../pages/auths/register/RegisterEmail.tsx';
import RegisterPassword from '../pages/auths/register/RegisterPassword.tsx';
import HomeRegister from '../pages/auths/HomeRegister';
import ProfileScreen from '../pages/about/ProfileScreen.tsx';
import { ChatBox } from '../pages/chat-box/chat-box.page.tsx';
import MainScreen from '../pages/main-screen/MainScreen.tsx';
import FeedScreen from '../pages/main-screen/FeedScreen.tsx';
import FriendsScreen from '../pages/friends/FriendsScreen.tsx';
import ListPhotoScreen from '../pages/main-screen/ListPhotoScreen.tsx';
import { ChatHistory } from '../pages/chat-history/ChatHistory.tsx';
import RegisterName from '../pages/auths/register/RegisterName.tsx';
import PhotoPreviewScreen from '../pages/main-screen/PhotoPreviewScreen.tsx';

export type RootStackParamList = {
  ChatBox: {
    groupChatId?: number;
    groupAvatar?:string;
    groupName?:string;
    listUser?: Array<number>;
  };
  HomeRegister: undefined;
  PhoneLogin: undefined;
  EmailLogin: undefined;
  PasswordInput: { email?: string, phone?: string };
  RegisterEmail: undefined;
  RegisterPassword: { email: string };
  RegisterName: { email: string, password: string};
  ProfileScreen: undefined;
  MainScreen: undefined;
  ChatHistory: undefined;
  FeedScreen: undefined;
  FriendsScreen: undefined;
  ListPhotoScreen: undefined;
  PhotoPreviewScreen: {
    photoUri: string;
    photoPath: string;
  };
};

// const Stack = createNativeStackNavigator<RootStackParamList>();

const Stack = createStackNavigator<RootStackParamList>();
const AppNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ChatHistory" screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: 150,
          },
        },
        close: {
          animation: 'timing',
          config: {
            duration: 150,
          },
        },
      },
    }}>
      <Stack.Screen name="ChatBox" component={ChatBox} />
      <Stack.Screen name="ChatHistory" component={ChatHistory} />
      <Stack.Screen name="HomeRegister" component={HomeRegister} />
      <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
      <Stack.Screen name="EmailLogin" component={EmailLogin} />
      <Stack.Screen name="PasswordInput" component={PasswordInput} />
      <Stack.Screen name="RegisterEmail" component={RegisterEmail} />
      <Stack.Screen name="RegisterPassword" component={RegisterPassword} />
      <Stack.Screen name="RegisterName" component={RegisterName} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
      <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
      <Stack.Screen name="ListPhotoScreen" component={ListPhotoScreen} />
      <Stack.Screen
        name="PhotoPreviewScreen"
        component={PhotoPreviewScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
