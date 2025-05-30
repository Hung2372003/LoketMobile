
import React, { useState } from 'react';
import {Message} from '../../component/message/message.component';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { PreviewCard } from '../../component/preview-card/preview-card.component';
import Feather from '@react-native-vector-icons/feather';
import { ChatBoxStyles } from './chat-box.style';
import { ImageCard } from '../../component/image-card/image-card.component';
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
        <ImageCard
            image="https://i.imgur.com/2nCt3Sbl.jpg"
            avatar="https://i.imgur.com/2nCt3Sbl.jpg"
            name="Nguyên Văn Ô"
            time="4 ngày"
            content="ahihiih hehehesdjkfgjskfgjehksdg"
        />
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
        <View style={[styles.sendContainer]}>
            <View style={[styles.inputContainer]}>
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
            <View style={[styles.sendButton]}>
              <TouchableOpacity style={[styles.button]}>
                <Feather name="send" size={28} color={'#232323d6'} />
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
 );
};
