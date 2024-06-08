import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, BackHandler, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { questions } from '../data/questions';
import { shuffleArray } from '../utils/shuffle';

const getRandomQuestions = () => {
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  return shuffledQuestions.map(q => ({
    ...q,
    answers: shuffleArray([...q.answers]),
  }));
};

const QuestionScreen = () => {
  const [quiz, setQuiz] = useState(getRandomQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string | null>>(Array(questions.length).fill(null));
  const [correctQuestions, setCorrectQuestions] = useState<Array<number>>([]);
  const navigation = useNavigation();

  const handleAnswerPress = (answer: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newSelectedAnswers);
  };

  useEffect(() => {
    if (selectedAnswers[currentQuestionIndex] === quiz[currentQuestionIndex].correct) {
      setCorrectQuestions((prevCorrectQuestions: number[]) => [...new Set([...prevCorrectQuestions, currentQuestionIndex])]);
    } else {
      setCorrectQuestions((prevCorrectQuestions: number[]) => prevCorrectQuestions.filter(correctAnswer => correctAnswer !== currentQuestionIndex));
    }
  }, [selectedAnswers[currentQuestionIndex]]);

  useEffect(() => {
    setScore(correctQuestions.length);
  }, [correctQuestions]);

  const handleNextPress = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const handlePreviousPress = () => {
    setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const resetQuizState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setCorrectQuestions([]);
  }, []);

  const handleSubmit = async () => {
    handleNavigateToSummary();
  };

  const handleNavigateToSummary = () => {
    navigation.navigate('Summary', { score, total: quiz.length });
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setTimeout(() => {
          resetQuizState();
        }, 1000);
      };
    }, [resetQuizState])
  );

  useEffect(() => {
    const onBackPress = () => {
      if (currentQuestionIndex > 0) {
        handlePreviousPress();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [currentQuestionIndex]);

  useEffect(() => {
    setQuiz(getRandomQuestions());
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setCorrectQuestions([]);
  }, []);

  const Separator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.questionNumber}>{`Question ${currentQuestionIndex + 1}/${quiz.length}`}</Text>
        <Text style={styles.questionText}>{quiz[currentQuestionIndex].question}</Text>
        {quiz[currentQuestionIndex].answers.map((answer, index) => (
          <View key={`group-${answer}-${index}`} >
            <Separator key={`separator-${answer}-${index}`} />
            <Button
              key={`answer-${answer}-${index}`}
              title={answer}
              onPress={() => handleAnswerPress(answer)}
              color={selectedAnswers[currentQuestionIndex] === answer ? 'blue' : 'gray'}
            />
          </View>
        ))}

        <View style={styles.navigationContainer}>
          <Text style={styles.debugText}>currentQuestionIndex: {currentQuestionIndex}</Text>
          <Text style={styles.debugText}>score: {score}</Text>
          <Text style={styles.debugText}>correctQuestions: {correctQuestions.join(', ')}</Text>
        </View>
      </View>

      <View style={styles.bottomNavigation}>
        <View style={styles.buttonContainer}>
          <Button
            title="< Previous"
            onPress={handlePreviousPress}
            disabled={currentQuestionIndex === 0}
          />
        </View>
        <View style={styles.buttonContainer}>
          {currentQuestionIndex < quiz.length - 1 ? (
            <Button
              title="Next >"
              onPress={handleNextPress}
              disabled={!selectedAnswers[currentQuestionIndex]}
            />
          ) : (
            <Button
              title="Submit"
              onPress={handleSubmit}
              disabled={!selectedAnswers[currentQuestionIndex]}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  answerButton: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
  },
  separator: {
    marginVertical: 8,
  },
  navigationContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default QuestionScreen;