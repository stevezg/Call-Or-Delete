import React, { Component } from 'react'
import {
  Button,
  ScrollView,
  Text,
  View,
  AlertIOS,
  StyleSheet
} from 'react-native'
import Expo from 'expo'
import Phone from 'react-native-phone-call'

export default class App extends Component {
  state = {
    number: '',
    name: '',
    id: '',
    started: false
  }
  _getContactList = async () => {}
  _getRandomContactsAsync = async () => {
    let { status } = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS)
    if (status !== 'granted') {
      console.error('permision not granted')
      return
    }
    this.setState({
      started: true
    })

    let contactData = await Expo.Contacts.getContactsAsync({})

    let maxNumberOfContacts = contactData.data.length

    //n = random-number
    let n = Math.floor(Math.random() * maxNumberOfContacts)
    let randomContactData = contactData.data[n]
    this.setState({
      number: randomContactData.phoneNumbers[0].number,
      name: randomContactData.name,
      id: randomContactData.id
    })
    // console.log(contactData)
    // console.log(maxNumberOfContacts)
    // console.log(randomContactData)
    // console.log(maxNumberOfContacts)
    // console.log(this.state.numberOfContacts)
    // console.log(n)
    // console.log(n)
    // console.log(randomContactData)
    // console.log(randomContactData.phoneNumbers[0].number)
    // console.log()
    console.log(randomContactData.name)

    // console.log(this.state.id)
    // console.log(randomContactData.phoneNumbers[0].number)
  }
  _deleteContact = async () => {
    console.log('deleting contact ' + this.state.name)
    let result = await Expo.Contacts.removeContactAsync(this.state.id)
    // Expo.Vibration.vibrate([1000, 2000, 3000])

    this._getRandomContactsAsync()
  }
  _callContact = () => {
    console.log('calling ' + this.state.name)
    const args = {
      number: this.state.number,
      prompt: true
    }
    Phone(args)
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.gameTitle}>Call Or Delete</Text>

          {this.state.number && (
            <Text style={styles.randomContactResult}> {this.state.name} </Text>
          )}

          <View style={styles.bottomRow}>
            {this.state.started && (
              <Button
                style={styles.deleteButton}
                title="Delete"
                onPress={() => {
                  AlertIOS.alert(
                    'Are you sure',
                    'Are you sure you want to delete this contact',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                      },
                      {
                        text: 'Yes',
                        onPress: () => this._deleteContact()
                      }
                    ]
                  )
                }}
              />
            )}

            <Button
              style={styles.playButton}
              title={!this.state.started ? 'Play' : 'Skip'}
              onPress={() => {
                this._getRandomContactsAsync()
              }}
            />
            {this.state.started && (
              <Button
                style={styles.callButton}
                title="Call"
                onPress={() => {
                  this._callContact()
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: Expo.Constants.statusBarHeight,
    // backgroundColor: '#ecf0f1'
    backgroundColor: 'black'
  },
  playButton: {
    height: 40,
    width: 40
  },
  randomContactResult: {
    color: 'pink',
    fontWeight: 'bold',
    fontSize: 30
  },
  gameTitle: {
    color: 'pink',
    fontSize: 40,
    fontWeight: 'bold'
  },
  deleteButton: {},
  callButton: {},
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
})
