import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, CircleCheck as CheckCircle, Circle as XCircle, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const quizQuestions = [
  {
    question: "What's the date i first texted you?",
    options: ["Feb 18", "Feb 20", "Mar 18", "Jan 18"],
    correct: 0,
  },
  {
    question: "When did you sing for me?",
    options: ["Mar 20", "Mar 22", "Mar 25", "Apr 22"],
    correct: 1,
  },
  {
    question: "What's my favorite thing about you?",
    options: ["Your smile", "Your laugh", "Everything", "Your kindness"],
    correct: 2,
  },
  {
    question: "What do I call you?",
    options: ["Beautiful", "Princess", "Angel", "Darling"],
    correct: 1,
  },
  {
    question: "What's our special secret date?",
    options: ["June 18", "July 18", "Aug 18", "May 18"],
    correct: 1,
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedIndex;
    setAnswers(newAnswers);

    if (selectedIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const getResultMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) {
      return "Perfect! You really know us! 💜✨";
    } else if (percentage >= 80) {
      return "Amazing! You know me so well! 💫";
    } else if (percentage >= 60) {
      return "Good job! We're getting closer! 💕";
    } else {
      return "We need to spend more time together! 😊💜";
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
  };

  if (showResult) {
    return (
      <LinearGradient colors={['#000000', '#1a0033', '#000000']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.resultContainer}>
            <Award size={80} color="#A020F0" />
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            <Text style={styles.scoreText}>
              You scored {score} out of {quizQuestions.length}
            </Text>
            <Text style={styles.resultMessage}>{getResultMessage()}</Text>
            
            <TouchableOpacity style={styles.button} onPress={restartQuiz}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#1a0033', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Brain size={50} color="#A020F0" />
          <Text style={styles.title}>Princess Quiz</Text>
          <Text style={styles.subtitle}>Let's see how well you know us! 💜</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {quizQuestions[currentQuestion].question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && (
                  index === quizQuestions[currentQuestion].correct
                    ? styles.correctOption
                    : styles.incorrectOption
                ),
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
              {selectedAnswer === index && (
                <View style={styles.optionIcon}>
                  {index === quizQuestions[currentQuestion].correct ? (
                    <CheckCircle size={24} color="#00FF00" />
                  ) : (
                    <XCircle size={24} color="#FF0000" />
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.currentScore}>Current Score: {score}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    color: '#A020F0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A020F0',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.3)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
  },
  questionText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  correctOption: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    borderColor: '#00FF00',
  },
  incorrectOption: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: '#FF0000',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  optionIcon: {
    marginLeft: 10,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  currentScore: {
    fontSize: 18,
    color: '#A020F0',
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 24,
    color: '#A020F0',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#A020F0',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    minWidth: 150,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});