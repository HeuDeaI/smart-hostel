import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { IconButton } from "react-native-paper";
import { white, primaryBlue, textDarkGray } from "../../../constants/Colors";
import Voice from "@react-native-voice/voice";
import {
  sendMessageToRasa,
  processRasaResponse,
} from "../../../services/rasaService";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";

const ChatAI = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Здравствуйте! Чем могу помочь?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);
  const scrollViewRef = useRef();
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    console.log("ChatAI component mounted");

    // Проверяем, что мы не на веб-платформе
    if (Platform.OS === "web") {
      console.log("Voice recognition is not available on web platform");
      setIsVoiceAvailable(false);
      return;
    }

    let isComponentMounted = true;

    const initializeVoice = async () => {
      console.log("Starting Voice initialization...");

      try {
        // Проверяем доступность Voice
        console.log("Checking Voice availability...");
        if (!Voice) {
          throw new Error("Voice module is not available");
        }

        const available = await Voice.isAvailable();
        console.log("Voice recognition available:", available);

        if (!available) {
          throw new Error("Voice recognition is not available on this device");
        }

        // Устанавливаем обработчики событий только если Voice доступен
        console.log("Setting up Voice event handlers...");

        const onSpeechStart = () => {
          console.log("Speech recognition started");
          if (isComponentMounted) {
            setIsListening(true);
          }
        };

        const onSpeechEnd = () => {
          console.log("Speech recognition ended");
          if (isComponentMounted) {
            setIsListening(false);
          }
        };

        const onSpeechResults = (e) => {
          console.log("Speech recognition results:", e);
          if (isComponentMounted && e && e.value && e.value[0]) {
            setInputText(e.value[0]);
          }
        };

        const onSpeechError = (e) => {
          console.error("Speech recognition error:", e);
          if (isComponentMounted) {
            setIsListening(false);
            Alert.alert(
              "Ошибка распознавания речи",
              "Не удалось распознать речь. Пожалуйста, попробуйте еще раз или используйте текстовый ввод."
            );
          }
        };

        // Привязываем обработчики
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        console.log("Voice event handlers set up successfully");
        setIsVoiceAvailable(true);
      } catch (error) {
        console.error("Voice initialization error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });

        if (isComponentMounted) {
          setIsVoiceAvailable(false);
          Alert.alert(
            "Ошибка инициализации",
            "Не удалось инициализировать распознавание речи. Пожалуйста, проверьте настройки устройства и перезапустите приложение."
          );
        }
      }
    };

    initializeVoice();

    return () => {
      console.log("ChatAI component unmounting, cleaning up Voice...");
      isComponentMounted = false;
      if (isVoiceAvailable) {
        try {
          Voice.destroy().then(Voice.removeAllListeners).catch(console.error);
        } catch (error) {
          console.error("Error cleaning up Voice:", error);
        }
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Разрешение на использование микрофона",
            message:
              "Приложению требуется доступ к микрофону для распознавания речи",
            buttonNeutral: "Спросить позже",
            buttonNegative: "Отмена",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error("Error requesting microphone permission:", err);
        return false;
      }
    }
    return true; // Для iOS разрешения запрашиваются автоматически
  };

  const startListening = async () => {
    if (!isVoiceAvailable) {
      Alert.alert(
        "Распознавание речи недоступно",
        "Пожалуйста, проверьте:\n1. Разрешения на использование микрофона\n2. Подключение к интернету\n3. Поддержку распознавания речи на вашем устройстве"
      );
      return;
    }

    try {
      // Запрашиваем разрешение перед началом записи
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        Alert.alert(
          "Нет доступа к микрофону",
          "Для использования голосового ввода необходимо предоставить доступ к микрофону в настройках приложения"
        );
        return;
      }

      console.log("Starting voice recognition...");
      await Voice.start("ru-RU");
    } catch (e) {
      console.error("Error starting voice recognition:", e);
      Alert.alert(
        "Ошибка",
        `Не удалось запустить распознавание речи: ${e.message}\nПожалуйста, проверьте разрешения и попробуйте снова.`
      );
    }
  };

  const stopListening = async () => {
    if (!isVoiceAvailable) return;

    try {
      console.log("Stopping voice recognition...");
      await Voice.stop();
    } catch (e) {
      console.error("Error stopping voice recognition:", e);
      Alert.alert(
        "Ошибка",
        `Не удалось остановить распознавание речи: ${e.message}`
      );
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === "" || isProcessing) return;

    // Добавляем сообщение пользователя
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      // Отправляем сообщение в Rasa
      const response = await sendMessageToRasa(inputText, userInfo.id);
      const processedResponse = processRasaResponse(response);

      // Добавляем ответ от AI
      const aiMessage = {
        id: messages.length + 2,
        text: processedResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      // Добавляем сообщение об ошибке
      const errorMessage = {
        id: messages.length + 2,
        text: "Извините, произошла ошибка при обработке вашего запроса.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "user" ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.sender === "user"
                  ? styles.userMessageText
                  : styles.aiMessageText,
              ]}
            >
              {message.text}
            </Text>
            <Text
              style={[
                styles.timestamp,
                message.sender === "user"
                  ? styles.userTimestamp
                  : styles.aiTimestamp,
              ]}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))}
        {isProcessing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={primaryBlue} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Введите сообщение..."
          placeholderTextColor={textDarkGray}
          multiline
          editable={!isProcessing}
        />
        {Platform.OS !== "web" && (
          <TouchableOpacity
            style={styles.voiceButton}
            onPressIn={startListening}
            onPressOut={stopListening}
            disabled={isProcessing}
          >
            <IconButton
              icon={isListening ? "microphone" : "microphone-outline"}
              size={24}
              iconColor={isListening ? primaryBlue : textDarkGray}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isProcessing}
        >
          <IconButton
            icon="send"
            size={24}
            iconColor={isProcessing ? textDarkGray : primaryBlue}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: primaryBlue,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  messageText: {
    fontSize: 16,
    fontFamily: "fontRegular",
  },
  userMessageText: {
    color: white,
  },
  aiMessageText: {
    color: textDarkGray,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  aiTimestamp: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontFamily: "fontRegular",
  },
  voiceButton: {
    marginRight: 8,
  },
  sendButton: {
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 8,
    alignItems: "center",
  },
});

export default ChatAI;
