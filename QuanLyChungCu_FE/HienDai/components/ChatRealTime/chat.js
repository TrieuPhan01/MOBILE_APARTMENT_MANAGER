import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useContext
} from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../../configs/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { MyUserContext } from '../../configs/Contexts';
import { ActivityIndicator, MD2Colors,Appbar } from 'react-native-paper';

export default function Chat() {
  const userA = useContext(MyUserContext) || "";
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{
              marginRight: 10
            }}
            onPress={onSignOut}
          >
            <AntDesign name="logout" size={24} color="#af70b5" style={{marginRight: 10}}/>
          </TouchableOpacity>
        )
      });
    }, [navigation]);

  useLayoutEffect(() => {

      const collectionRef = collection(database, 'chats');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, querySnapshot => {
     
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user
          }))
        );
        setLoading(false);
      });
     
  return unsubscribe;
    }, []);

  const onSend = useCallback((messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages)
      );
      // setMessages([...messages, ...messages]);
      const { _id, createdAt, text, user } = messages[0];  
      user._id === userA.email
      console.log(user) 
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        text,
        user
      });
    }, []);

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: '#f6f8fa', borderBottomWidth: 2, borderBottomColor: '#ddd', marginBottom: 3 }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Chat Chung cư Hiền Vy" />
        </Appbar.Header>
    
        {loading ? (
          <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} animating={true} color={MD2Colors.red800} />
        ) : (
          <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={false}
            showUserAvatar={true}
            onSend={messages => onSend(messages)}
            messagesContainerStyle={{
              backgroundColor: '#fff'
            }}
            textInputStyle={{
              backgroundColor: '#fff',
              borderRadius: 20,
            }}
            user={{
              _id: auth?.currentUser?.email,
              avatar: userA.avatar_acount
            }}
          />
        )}
      </View>
    );
    
}