import axios from "axios";

const RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook";

export const sendMessageToRasa = async (message, senderId) => {
  try {
    const response = await axios.post(RASA_API_URL, {
      sender: senderId,
      message: message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message to Rasa:", error);
    throw error;
  }
};

export const processRasaResponse = (response) => {
  if (!response || response.length === 0) {
    return "Извините, я не смог обработать ваш запрос.";
  }

  // Получаем первый ответ от Rasa
  const firstResponse = response[0];

  // Проверяем наличие текста в ответе
  if (firstResponse.text) {
    return firstResponse.text;
  }

  // Если нет текста, возвращаем сообщение об ошибке
  return "Извините, произошла ошибка при обработке ответа.";
};
