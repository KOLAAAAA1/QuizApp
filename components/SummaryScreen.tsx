import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { record } from '../constants/record';

const SummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { total } = route.params;
  const [userName, setUserName] = useState('');
  const { score } = route.params;

  const handleBackToFirstQuestion = () => {
    navigation.navigate('Question');
  };

  const handleSubmit = async () => {
    try {
      // Save user name and score in AsyncStorage
      const scoreRecord: record = {
        user_name: userName,
        score: score.toString(),
        created_at: new Date(),
      };
      let leaderboard: record[] = [];

      const rawLeaderboard = await AsyncStorage.getItem('records');
      if (rawLeaderboard) {
        leaderboard = JSON.parse(rawLeaderboard);
        if (leaderboard && leaderboard.length > 0) {
          leaderboard = [...leaderboard, ...[scoreRecord]].sort((a: record, b: record) => {
            if (a.score > b.score) {
              return -1;
            }

            if (a.score < b.score) {
              return 1;
            }

            if (a.created_at < b.created_at) {
              return 1;
            }

            return 0;

          });
        }
      } else {
        leaderboard = [scoreRecord];
      }


      await AsyncStorage.setItem('records', JSON.stringify(leaderboard));
      // Navigate back to the first question screen
      handleBackToFirstQuestion();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Score: ${score} / ${total}`}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={userName}
        onChangeText={setUserName}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default SummaryScreen;