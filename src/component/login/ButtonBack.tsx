import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './login.module'
import { Text } from 'react-native-gesture-handler'

interface Props {
    onBackPage: () => void,
}

const ButtonBack = ({
    onBackPage,
}:Props) => {
  return (
    <View style={styles.back}>
        <TouchableOpacity
            style={styles.button_back}
            onPress={onBackPage}
        >
            <Text style={{color: '#e5e5e5', fontWeight: '300', fontSize: 30}}> {'<'} </Text>
        </TouchableOpacity>
    </View>
  )
}

export default ButtonBack