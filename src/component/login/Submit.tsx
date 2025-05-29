import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './login.module';

interface Props {
  onSubmit: () => void;
}

const Submit = ({onSubmit}: Props) => {
  return (
    <View style={styles.submit}>
      <Text style={styles.fqa}>
        Thông qua việc chạm vào nút Tiếp tục, bạn đồng ý với các Điều khoản dịch
        vụ và Chính sách quyền riêng tư của chúng tôi
      </Text>
      <TouchableOpacity style={styles.button_continue} onPress={onSubmit}>
        <Text style={{color: '#e5e5e5', fontWeight: '500', fontSize: 18}}>
          Tiếp tục
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Submit;
