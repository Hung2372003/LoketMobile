import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './login.module';

interface Props {
  onSubmit: () => void;
  disabled?: boolean;
}

const Submit = ({onSubmit, disabled}: Props) => {
  
  const buttonBackgroundColor = disabled ? '#232227' : '#ffb700';
  const textColor = disabled ? '#e5e5e5' : '#232227';
  
  return (
    <View style={styles.submit}>
      <Text style={styles.fqa}>
        Thông qua việc chạm vào nút Tiếp tục, bạn đồng ý với các
        <Text style={{color: '#e5e5e5'}}> Điều khoản dịch vụ </Text>
        và
        <Text style={{color: '#e5e5e5'}}> Chính sách quyền riêng tư </Text>
        của chúng tôi
      </Text>
      <TouchableOpacity
        style={[
          styles.button_continue,
          { backgroundColor: buttonBackgroundColor },
        ]}
        onPress={onSubmit}
        disabled={disabled}
      >
        <Text
          style={[
            {color: '#e5e5e5', fontWeight: '500', fontSize: 18},
            { color: textColor },
          ]}
        >
          Tiếp tục  ➜
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Submit;
