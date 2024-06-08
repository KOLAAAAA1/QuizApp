import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { record } from '../constants/record';

const LeaderboardScreen = () => {
  const [sortedLeaderboard, setSortedLeaderboard] = useState<record[]>([]);

  const fetchLeaderboard = async () => {
    try {
      // Retrieve user names and scores from AsyncStorage
      const rawLeaderboard = await AsyncStorage.getItem('records');
      if (rawLeaderboard) {
        let leaderboard: record[] = JSON.parse(rawLeaderboard);
        if (leaderboard && leaderboard.length > 0) {
          setSortedLeaderboard(
            leaderboard.sort((a: record, b: record) => {
              if (Number(a.score) > Number(b.score)) {
                return -1;
              }
              if (Number(a.score) < Number(b.score)) {
                return 1;
              }
              if (a.created_at < b.created_at) {
                return 1;
              }
              return 0;
            })
          );
        } else {
          setSortedLeaderboard([]);
        }
      } else {
        setSortedLeaderboard([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const clearAsyncStorage = async () => {
    await AsyncStorage.clear();
    fetchLeaderboard(); // Refresh the leaderboard after clearing storage
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLeaderboard();
    }, [])
  );

  const _renderItem = ({ item, index }) => (
    <DataTable.Row>
      <DataTable.Cell style={styles.cell}>{`${index + 1}.`}</DataTable.Cell>
      <DataTable.Cell style={styles.cellMinWidth}>{item.user_name}</DataTable.Cell>
      <DataTable.Cell style={styles.cell}>{item.score}</DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <View style={styles.container}>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title style={styles.cell}>Ranking</DataTable.Title>
          <DataTable.Title style={styles.cellMinWidth}>Name</DataTable.Title>
          <DataTable.Title numeric style={styles.cell}>Score</DataTable.Title>
        </DataTable.Header>

        {sortedLeaderboard.length > 0 ? (
          <FlatList
            data={sortedLeaderboard}
            renderItem={_renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
          />
        ) : (
          <DataTable.Row>
            <DataTable.Cell>No Data</DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable>
      <View style={styles.buttonContainer}>
        <Button title="Reset Leaderboard (Clear Async Storage)" onPress={clearAsyncStorage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  table: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
  },
  cell: {
    justifyContent: 'flex-start',
  },
  cellMinWidth: {
    flex: 3,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
  },
});

export default LeaderboardScreen;