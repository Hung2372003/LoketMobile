import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './login.module';

interface Props {
    title: string,
    onChangeMethod: () => void,
}

const Option = ({
    title,
    onChangeMethod,
}:Props) => {

    return (
        <View style = {styles.option}>
            <TouchableOpacity
                style={styles.button_change_method}
                onPress={onChangeMethod}
            >
                <Text style={{color: '#e5e5e5', fontWeight: '500'}}>{title}</Text>
            </TouchableOpacity>
        </View>
    );

}

export default Option