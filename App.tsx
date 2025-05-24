// App.tsx
// import React, {useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import CameraComponent from './component/testCameraComponent/CameraTest';
// import MessageScreen from './component/testComponent/ListFriend';

// export default function App() {
//   const [photoUri, setPhotoUri] = useState<string | null>(null);

//   const handlePhotoCaptured = (uri: string) => {
//     setPhotoUri(uri);
//   };

//   return (
//     <SafeAreaView style={styles.fullScreen}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//       <View style={styles.fullWidth}>
//         <CameraComponent onPhotoCaptured={handlePhotoCaptured} />
//         {photoUri && (
//           <Text style={styles.text}>Ảnh đã chụp: {photoUri}</Text>
//         )}
//       </View>

//       <View style={styles.fullWidth}>
//         <MessageScreen />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   fullScreen: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   fullWidth: {
//     width: '100%',
//     height:'100%',
//     padding: 10,
//   },
//   text: {
//     marginTop: 10,
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });


import React from 'react';
import {StyleSheet, StatusBar, View, SafeAreaView } from 'react-native';
import MessageScreen from './src/component/testComponent/ListFriend';
import HomeRegister from './src/pages/auths/HomeRegister';
import PhoneLogin from './src/pages/auths/PhoneLogin';
import AuthInput from './src/component/login/AuthInput';
import EmailLogin from './src/pages/auths/EmailLogin';
import PasswordInput from './src/pages/auths/PasswordInput';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Option from './src/component/login/Option';
import Submit from './src/component/login/Submit';


const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;

