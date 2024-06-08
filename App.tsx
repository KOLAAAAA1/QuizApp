import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import QuestionScreen from './components/QuestionScreen';
import SummaryScreen from './components/SummaryScreen';
import LeaderboardScreen from './components/LeaderBoardScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const QuestionStack = createStackNavigator();
const LeaderboardStack = createStackNavigator();

const QuestionStackScreen = () => (
  <QuestionStack.Navigator>
    <QuestionStack.Screen name="Question" component={QuestionScreen} />
    <QuestionStack.Screen name="Summary" component={SummaryScreen} />
  </QuestionStack.Navigator>
);

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Questions"
            component={QuestionStackScreen}
            options={{
              tabBarLabel: 'Questions',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="quiz" color={color} size={size} onLayout={() => console.log('Quiz icon layout')} />
              ),
            }} 
          />
          <Tab.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{
              tabBarLabel: 'Leaderboard',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="leaderboard" color={color} size={size} onLayout={() => console.log('Leaderboard icon layout')} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default App;
