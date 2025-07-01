import React, { useState } from 'react'
import {Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './login.module';
import Icon from '@react-native-vector-icons/feather';


interface Props {
    value: string;
    onChangeText: (text: string) => void;
    title: string;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    secureTextEntry?: boolean;
}

const AuthInput: React.FC<Props> = ({
    value,
    onChangeText,
    title,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <Text style={{ color: '#e5e5e5', fontSize: 25, fontWeight: 'bold', marginBottom: 20 }}>
                {title}
                </Text>

                <View style={[styles.text_input, { flexDirection: 'row', alignItems: 'center', paddingRight: 15 }]}>
                <TextInput
                    style={{ flex: 1, color: '#fff', fontSize: 18 }}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#94908f"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    onChangeText={onChangeText}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={{ padding: 5 }}>
                    <Icon
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        size={20}
                        color="#94908f"
                    />
                    </TouchableOpacity>
                )}
                </View>

            </View>
        </View>
    );
};


export default AuthInput;