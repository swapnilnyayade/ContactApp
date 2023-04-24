/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from 'react-native';

function App() {
  const [list, setList] = useState([]);
  const [modalContact, setModalContact] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState(undefined);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState(undefined);
  const [description, setDescription] = useState('');

  const getListContact = async () => {
    let result = await fetch('http://10.0.2.2:3000/contacts');
    result = await result.json();
    setList(result);
  };

  const handleRemove = async (item) => {
    let id = item.id;
    let result = await fetch(`http://10.0.2.2:3000/contacts/${id}`, {
      method: 'Delete',
    });
    result = await result.json();
    if (result) {
      console.warn('Contact Deleted');
      getListContact();
    }
  };

  const handleCreate = () => {
    setModalContact(true);
  };

  const handleCloseModal = () => {
    setModalContact(false);
  };

  const handleSave = async () => {

    if(id === null){
      console.warn("if")
      let result = await fetch(`http://10.0.2.2:3000/contacts`, {
        method: 'Post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, age, email, mobile, description})
      });
      result = await result.json();
      if (result) {
        console.warn('Contact Saved');
        clearForm()
        getListContact();
        setModalContact(false)
      }
    }else{
      console.warn("else")
      let result = await fetch(`http://10.0.2.2:3000/contacts/${id}`, {
        method: 'Put',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, age, email, mobile, description})
      });
      result = await result.json();
      if (result) {
        console.warn('Contact Updated');
        clearForm()
        getListContact();
        setModalContact(false)
      }
    }

   
  };

  const handleEdit = (item) => {
    setId(item.id)
    setName(item.name)
    setAge(item.age.toString())
    setEmail(item.email)
    setMobile(item.mobile.toString())
    setDescription(item.description)
    setModalContact(true)
  }

  const clearForm = () => {
    setName("")
    setAge("")
    setEmail("")
    setMobile("")
    setDescription("")
    setId(null)
  }

  useEffect(() => {
    getListContact();
  }, []);

  return (
    <SafeAreaView>
      <Modal visible={modalContact}>
        <SafeAreaView>
          <View style={[styles.rowBetween, {paddingHorizontal: 10}]}>
            <Text style={styles.txtClose}>New Contact</Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.txtClose}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: 10, marginTop: 20}}>
            <Text>Name</Text>
            <TextInput
              style={styles.txtInput}
              placeholder="Enter Name"
              value={name}
              onChangeText={text => {
                setName(text);
              }}
            />

            <Text>Age</Text>
            <TextInput
              style={styles.txtInput}
              placeholder="Enter Age"
              value={age}
              onChangeText={text => {
                setAge(text);
              }}
            />

            <Text>Email</Text>
            <TextInput
              style={styles.txtInput}
              placeholder="Enter Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
              }}
            />

            <Text>Mobile</Text>
            <TextInput
              style={styles.txtInput}
              placeholder="Enter Mobile"
              value={mobile}
              onChangeText={text => {
                setMobile(text);
              }}
            />

            <Text>Description</Text>
            <TextInput
              style={styles.txtInput}
              placeholder="Enter Description"
              value={description}
              onChangeText={text => {
                setDescription(text);
              }}
            />

            <TouchableOpacity onPress={handleSave} style={styles.btnContainer}>
              <Text style={styles.txtClose}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.rowBetween}>
        <Text style={styles.txtMain}>Contact List {list.length}</Text>
        <TouchableOpacity style={{padding: 10}} onPress={handleCreate}>
          <Text style={{color: 'blue', fontWeight: 'bold'}}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
        {list.length
          ? list.map((item, index) => {
              return (
                <View key={index} style={styles.rowBetween}>
                  <View style={styles.item}>
                    <Text style={styles.txtName}>{item.name}</Text>
                    <Text style={styles.txtNormal}>{item.age}</Text>
                    <Text style={styles.txtNormal}>{item.email}</Text>
                    <Text style={styles.txtNormal}>{item.description}</Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => handleRemove(item)}>
                      <Text style={styles.txtDelete}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Text style={styles.txtEdit}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  txtMain: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  item: {},
  txtName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtNormal: {
    fontSize: 14,
    color: '#444',
  },
  txtDelete: {
    color: 'red',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
  },
  txtClose: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#888',
    marginBottom: 10,
  },
  btnContainer:{
    borderWidth:1,
    borderColor: "gray",
    padding: 10,
    backgroundColor: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtEdit: {
    color: 'blue'
  }
});

export default App;
