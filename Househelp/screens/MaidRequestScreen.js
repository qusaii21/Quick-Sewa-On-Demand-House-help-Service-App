import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('http://192.168.113.117:5000'); // Replace with your server URL

const MaidRequestScreen = ({ navigation }) => {
  const [storedMaidUsername, setStoredMaidUsername] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  const getStoredMaidUsername = async () => {
    try {
      const username = await AsyncStorage.getItem('maidUsername');
      if (username) {
        setStoredMaidUsername(username);
      } else {
        Alert.alert('Error', 'Maid username not found, please log in again.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error retrieving maid username:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('http://192.168.113.117:5000/requests/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      Alert.alert('Error', 'Failed to fetch pending requests');
    }
  };

  useEffect(() => {
    getStoredMaidUsername();

    if (storedMaidUsername) {
      socket.emit('registerMaid', storedMaidUsername);
    }

    fetchPendingRequests();

    socket.on('maidRequest', (request) => {
      setPendingRequests((prev) => [request, ...prev]);
      Alert.alert(`New request from user: ${request.username}`);
    });

    return () => {
      socket.off('maidRequest');
    };
  }, [storedMaidUsername, navigation]);

  const handleAccept = async (requestId) => {
    const requestToAccept = pendingRequests.find((req) => req._id === requestId);
    if (!requestToAccept) {
      Alert.alert('Error', 'Request not found');
      return;
    }

    try {
      await Promise.all([
        axios.put(`http://192.168.113.117:5000/requests/status/${requestId}`, { status: 'accepted' }),
        axios.post('http://192.168.113.117:5000/acceptedrequests', {
          maidUsername: storedMaidUsername,
          requestData: requestToAccept,
        }),
      ]);

      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      Alert.alert('You have accepted the request!');
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleDeny = async (requestId) => {
    try {
      await axios.put(`http://192.168.113.117:5000/requests/status/${requestId}`, { status: 'denied' });
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      Alert.alert('You have denied the request!');
    } catch (error) {
      console.error('Error denying request:', error);
      Alert.alert('Error', 'Failed to deny request');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPendingRequests();
    setRefreshing(false);
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.infoText}>User: {item.username}</Text>
      <Text style={styles.infoText}>Phone: {item.phone}</Text>
      <Text style={styles.infoText}>Address: {item.address}</Text>
      <Text style={styles.infoText}>Date: {item.date}</Text>
      <Text style={styles.infoText}>Time: {item.time}</Text>
      <Text style={styles.infoText}>Details: {item.details}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleAccept(item._id)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.denyButton]} onPress={() => handleDeny(item._id)}>
          <Text style={styles.buttonText}>Deny</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Requests:</Text> 
      {pendingRequests.length > 0 ? (
        <FlatList
          data={pendingRequests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.noRequestContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.infoText}>No new requests...</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#7b1fa2',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f3e5f5',
  },
  infoText: {
    fontSize: 16,
    color: '#4a148c',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  denyButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noRequestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MaidRequestScreen;
