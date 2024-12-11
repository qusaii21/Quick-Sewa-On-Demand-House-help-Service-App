import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.113.117:5000'); // Replace with your server URL

const UserRequestScreen = ({ route }) => {
  const { username } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [acceptedMaidInfo, setAcceptedMaidInfo] = useState(null);
  const [showAcceptedRequest, setShowAcceptedRequest] = useState(false);
  const isSending = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.113.117:5000/users/${username}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();

    socket.on('maidAccepted', async (response) => {
      try {
        const maidResponse = await axios.get(
          `http://192.168.113.117:5000/acceptedrequests/${response.requestId}`
        );
        setAcceptedMaidInfo(maidResponse.data);
        setShowAcceptedRequest(true);
        Alert.alert(`Your request has been accepted by maid: ${response.maidUsername}`);
      } catch (error) {
        console.error('Error fetching accepted maid info:', error);
      }
    });

    return () => {
      socket.off('maidAccepted');
    };
  }, [username]);

  const handleRequest = async () => {
    if (!date || !time || !details) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSending.current) return;

    isSending.current = true;

    const request = {
      date,
      time,
      details,
      userId: userInfo ? userInfo._id : null,
      username: userInfo ? userInfo.username : null,
      phone: userInfo ? userInfo.phone : null,
      address: userInfo ? userInfo.address : null,
    };

    try {
      console.log('Sending request:', request);
      await axios.post('http://192.168.113.117:5000/requests', request);
      socket.emit('maidRequest', request);
      Alert.alert('Success', 'Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Failed to send request');
    } finally {
      isSending.current = false;
    }
  };

  const fetchAcceptedRequestInfo = async () => {
    if (showAcceptedRequest) {
      setAcceptedMaidInfo(null);
      setShowAcceptedRequest(false);
    } else {
      try {
        const response = await axios.get(
          `http://192.168.113.117:5000/acceptedrequests/${userInfo.username}`
        );
        if (response.data.length > 0) {
          setAcceptedMaidInfo(response.data[0]);
        } else {
          Alert.alert('No accepted requests found');
        }
        setShowAcceptedRequest(true);
      } catch (error) {
        console.error('Error fetching accepted request info:', error);
        Alert.alert('Error', 'Failed to fetch accepted request info');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userInfo ? (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.headerText}>User's Information</Text>
            <Text style={styles.infoText}>Username: {userInfo.username}</Text>
            <Text style={styles.infoText}>Phone: {userInfo.phone}</Text>
            <Text style={styles.infoText}>Address: {userInfo.address}</Text>
          </View>

          <View style={styles.requestCard}>
            <Text style={styles.subHeaderText}>Send Request</Text>
            <Text style={styles.infoText}>Fill in the below details</Text>
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              style={styles.input}
              placeholderTextColor="#9c27b0"
            />
            <TextInput
              placeholder="Time (HH:MM)"
              value={time}
              onChangeText={setTime}
              style={styles.input}
              placeholderTextColor="#9c27b0"
            />
            <TextInput
              placeholder="Service Type and Payment"
              value={details}
              onChangeText={setDetails}
              style={styles.input}
              placeholderTextColor="#9c27b0"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleRequest}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.fetchButton} onPress={fetchAcceptedRequestInfo}>
            <Text style={styles.buttonText}>Request Status</Text>
          </TouchableOpacity>

          {showAcceptedRequest && acceptedMaidInfo && (
            <View style={styles.maidInfoContainer}>
              <Text style={styles.infoText}>Maid Accepted Your Request:</Text>
              <Text style={styles.infoText}>Username: {acceptedMaidInfo.username1}</Text>
              <Text style={styles.infoText}>Phone: {acceptedMaidInfo.maidPhone}</Text>
              <Text style={styles.infoText}>Date: {acceptedMaidInfo.date}</Text>
              <Text style={styles.infoText}>Time: {acceptedMaidInfo.time}</Text>
              <Text style={styles.infoText}>Details: {acceptedMaidInfo.details}</Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.infoText}>Loading user info...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#f3e5f5',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  requestCard: {
    backgroundColor: '#f3e5f5',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#4a148c',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#7b1fa2',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    color: '#4a148c',
  },
  submitButton: {
    backgroundColor: '#9c27b0',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  fetchButton: {
    backgroundColor: '#9c27b0',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  maidInfoContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#7b1fa2',
    borderRadius: 8,
    backgroundColor: '#f3e5f5',
    width: '100%',
  },
});

export default UserRequestScreen;
