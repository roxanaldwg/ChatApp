import React from "react";
import { GiftedChat, Bubble, SystemMessage, Day } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';

import * as firebase from "firebase";
import "firebase";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEGsqAiUhww9GtCkcB9QVGqB20N7c20GA",
  authDomain: "chatapp-d5880.firebaseapp.com",
  projectId: "chatapp-d5880",
  storageBucket: "chatapp-d5880.appspot.com",
  messagingSenderId: "178120802411",
  appId: "1:178120802411:web:734a85711d9dfa9372712e"
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
      location: null,
    };

    //initializing firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference to the Firestore messages collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.refMsgsUser = null;
  }

  onCollectionUpdate = QuerySnapshot => {
    const messages = [];
    // go through each document
    QuerySnapshot.forEach(doc => {
      // get the queryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages: messages,
    });
  };


  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      // update user state with currently active data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        },
      });
      // listens for updates in the collection
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
      //referencing messages of current user
      this.refMsgsUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  addMessage() {
    const message = this.state.messages[0];
    // add a new message to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: this.state.user,
    });
  }

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#66CDAA'
          },
          left: {
            backgroundColor: '#FFFACD'
          }
        }}
      />
    )
  }

  renderSystemMessage(props) {
    return <SystemMessage {...props} textStyle={{ color: '#736357' }} />;
  }

  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{
          color: '#fff',
          backgroundColor: '#9e938c',
          borderRadius: 15,
          padding: 10,
        }}
      />
    );
  }

  render() {
    //Updates name on chat screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    //changes bgcolor on chat screen
    const { bgColor } = this.props.route.params;

    return (
      <View style={styles.container}>
        <View style={{
          flex: 1,
          backgroundColor: bgColor
        }}>
          <GiftedChat
            style={styles.giftedChat}
            renderBubble={this.renderBubble.bind(this)}
            renderSystemMessage={this.renderSystemMessage}
            renderDay={this.renderDay}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.user._id,
              name: this.state.name,
              avatar: this.state.user.avatar,
            }}
          />
          {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftedChat: {
    color: '#000',
  },
});