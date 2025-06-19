import React from 'react'
import {Text, TextInput, View } from 'react-native';
import styles from './login.module';


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
    secureTextEntry,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <Text style={{color: '#e5e5e5', fontSize: 25, fontWeight: 'bold', marginBottom: 20}}>{title}</Text>
                <TextInput
                    style={styles.text_input}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#94908f"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    onChangeText={onChangeText}
                />
            </View>
        </View>
    );
};


export default AuthInput;