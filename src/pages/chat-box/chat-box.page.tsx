
import React, { useState } from 'react';
import {Message} from '../../component/message/message.component';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { PreviewCard } from '../../component/preview-card/preview-card.component';
import Feather from '@react-native-vector-icons/feather';
import { ChatBoxStyles } from './chat-box.style';
export const ChatBox:React.FC <{}> = () =>{
  const styles = ChatBoxStyles;
  const [text, setText] = useState('');

 return (
    <View style={[styles.chatBoxContainer]}>
      <View style={[styles.header]}>
        <TouchableOpacity>
          <Feather name="arrow-left" size={27} color={'white'} />
        </TouchableOpacity>
        <View>
          <PreviewCard
              avatar="https://i.imgur.com/2nCt3Sbl.jpg"
              title="Nguyễn Văn A"
              isRead={true}
          />
        </View>
      </View>
      <ScrollView style={[styles.section]}>

        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!\nBạn khỏe không?'}
          time="10:30 AM"
          sentMessage={false}
          startMessage={true}
        />

        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!\nBạn khỏe không?'}
          time="10:30 AM"
          sentMessage={false}
          startMessage={true}
          endMessage={true}

        />

        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!\nBạn khỏe không?'}
          time="10:30 AM"
          sentMessage={false}
          startMessage={true}
          endMessage={true}
        />

        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!\nBạn khỏe không?'}
          time="10:30 AM"
          sentMessage={false}
             startMessage={true}
          endMessage={true}
        />

        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!\nBạn khỏe không?'}
          time="10:30 AM"
          sentMessage={false}
             startMessage={true}
          endMessage={true}
        />
        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!Bạn khỏe không?ghfyufythdytdtyrdtrtuytuytuytutuytuytyuruyuytuyuityiutititiutiutiutitititiutiut'}
          sentMessage={false}
          endMessage={true}
        />
        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!guỳtryrrytrytrytrytttttttttttttttttttttttttttttttttttttttttttttttttttretretetretetertetregfhdgfdfgdgdgfdgdgfdgfd'}
          sentMessage={true}
          startMessage={true}
        />
        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!guỳtryrrytrytrytrytttttttttttttttttttttttttttttttttttttttttttttttttttretretetretetertetregfhdgfdfgdgdgfdgdgfdgfd'}
          sentMessage={true}
          startMessage={true}
          endMessage={true}
        />
        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!guỳtryrrytrytrytrytttttttttttttttttttttttttttttttttttttttttttttttttttretretetretetertetregfhdgfdfgdgdgfdgdgfdgfd'}
          sentMessage={true}
          startMessage={true}
          endMessage={true}
        />
        <Message
          avatar="https://i.imgur.com/2nCt3Sbl.jpg"
          content={'Xin chào!guỳtryrrytrytrytrytttttttttttttttttttttttttttttttttttttttttttttttttttretretetretetertetregfhdgfdfgdgdgfdgdgfdgfd'}
          sentMessage={true}
          endMessage={true}
        />
      </ScrollView>
      <View style={[styles.footer]}>
        <TextInput
            style={[styles.input]}
            placeholder="Gửi tin nhắn..."
            placeholderTextColor="#ccc"
            value={text}
            onChangeText={setText}
            multiline={true}
            textAlignVertical="top"
            blurOnSubmit={false}
            returnKeyType="default"
        />

      </View>
    </View>
 );
};
