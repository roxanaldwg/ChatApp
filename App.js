import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
          placeholder='Type here ...'
        />
        <Text>You wrote: {this.state.text}</Text>
        <Button
          onPress={() => {
            this.alertMyText({ text: this.state.text });
          }}
          title="Press Me"
        />
        <ScrollView>
          <Text style={{ fontSize: 110 }}>This text is so big! And so long! You have to scroll!</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  box1: {
    flex: 10,
    backgroundColor: 'blue'
  },
  box2: {
    flex: 80,
    backgroundColor: 'red'
  },
  box3: {
    flex: 50,
    backgroundColor: 'green'
  }
});