import { View, Text, RefreshControl, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
   black,
   darkGreen,
   darkRed,
   lightGray,
   primaryBlue,
   textDarkGray,
   white,
} from "../../../constants/Colors";
import {
   Button,
   List,
   TouchableRipple,
   TextInput,
   Avatar,
   Portal,
   Modal,
} from "react-native-paper";
import { DatePickerInput } from 'react-native-paper-dates';
import { useCallback, useState, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const Rooms = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const [roommateFields, setRoommateFields] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
   const formikRef = useRef();
   const [formValues, setFormValues] = useState(null);
   const { t } = useTranslation();

   const data = require("../../../data/dummyData.json");

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
         setRefreshing(false);
      }, 1500);
   }, []);

   const updateRoommateFields = useCallback((amount) => {
      const count = Number(amount);
      if (count > 1 && count <= 4) {
         setRoommateFields(Array(count - 1).fill(''));
      } else {
         setRoommateFields([]);
      }
   }, []);

   const handleRequestRoom = (values) => {
      //request room logic
      console.log(values);
      // После успешной отправки очищаем форму
      if (formikRef.current) {
         formikRef.current.resetForm();
         updateRoommateFields(0);
         setIsConfirmModalVisible(true)
      }
      setIsModalVisible(false);
   };

   const handleSubmitWithConfirmation = (values) => {
      setFormValues(values);
      setIsModalVisible(true);
   };

   const requestRoomSchema = Yup.object({
      amount_of_people: Yup.number()
         .positive('Must be positive')
         .min(1, 'Minimum 1 person allowed')
         .max(4, 'Maximum 4 people allowed')
         .required("Amount of people is required"),
      roommates: Yup.array().of(
         Yup.string().email("Enter a valid email!")
      ).test('len', 'Must add all roommates', function(val) {
         const amount = this.parent.amount_of_people;
         return val.length === (Number(amount) - 1);
      }),
      reason: Yup.string().required("Reason is required"),
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
         .required("End date is required")
         .min(Yup.ref('startDate'), "End date can't be before start date"),
   });

   return (
      <View style={{ flex: 1, backgroundColor: white, minHeight: "100%" }}>
         
         <Portal>
            <Modal
               visible={isConfirmModalVisible}
               onDismiss={() => setIsConfirmModalVisible(false)}
               contentContainerStyle={styles.modalContainer}
            >
               <Text style={styles.modalTitle}>Успешно!</Text>
               <Text style={styles.modalText}>
                  Ваши данные успешно отправлены.
               </Text>
               <View style={styles.modalButtons}>
                  <Button
                     mode="outlined"
                     onPress={() => setIsConfirmModalVisible(false)}
                     style={styles.modalButton}
                     labelStyle={{ color: primaryBlue }}
                  >
                     Закрыть
                  </Button>
                  
               </View>
            </Modal>
         </Portal>
         
         <Portal>
            <Modal
               visible={isModalVisible}
               onDismiss={() => setIsModalVisible(false)}
               contentContainerStyle={styles.modalContainer}
            >
               <Text style={styles.modalTitle}>Подтверждение бронирования</Text>
               <Text style={styles.modalText}>
                  Вы уверены, что хотите отправить запрос на бронирование?
               </Text>
               <View style={styles.modalButtons}>
                  <Button
                     mode="outlined"
                     onPress={() => setIsModalVisible(false)}
                     style={styles.modalButton}
                     labelStyle={{ color: primaryBlue }}
                  >
                     Отмена
                  </Button>
                  <Button
                     mode="contained"
                     onPress={() => handleRequestRoom(formValues)}
                     style={[styles.modalButton, { marginLeft: 10 }]}
                     buttonColor={primaryBlue}
                  >
                     Подтвердить
                  </Button>
               </View>
            </Modal>
         </Portal>

         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <Text style={styles.reqRoomTitle}>{t("user.booking.newBooking")}</Text>
               <View style={styles.formContainer}>
                  <Formik
                     innerRef={formikRef}
                     validationSchema={requestRoomSchema}
                     initialValues={{
                        amount_of_people: "",
                        roommates: [],
                        reason: "",
                        startDate: undefined,
                        endDate: undefined,
                     }}
                     onSubmit={handleSubmitWithConfirmation}
                  >
                     {({
                        handleChange,
                        handleSubmit,
                        handleBlur,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                     }) => {
                        return (
                           <View style={styles.form}>
                              <View style={styles.datesWrapper}>
                                 <View style={styles.dateContainer}>
                                    <DatePickerInput
                                       locale="en"
                                       label="Start Date"
                                       value={values.startDate}
                                       onChange={(date) => setFieldValue('startDate', date)}
                                       onBlur={handleBlur('startDate')}
                                       mode="outlined"
                                       style={styles.dateInput}
                                       inputMode="start"
                                       outlineColor={lightGray}
                                       activeOutlineColor={primaryBlue}
                                    />
                                    {errors.startDate && touched.startDate && (
                                       <Text style={styles.errorText}>{errors.startDate}</Text>
                                    )}
                                 </View>
                                 
                                 <View style={[styles.dateContainer, { marginTop: 16 }]}>
                                    <DatePickerInput
                                       locale="en"
                                       label="End Date"
                                       value={values.endDate}
                                       onChange={(date) => setFieldValue('endDate', date)}
                                       onBlur={handleBlur('endDate')}
                                       mode="outlined"
                                       style={styles.dateInput}
                                       inputMode="start"
                                       outlineColor={lightGray}
                                       activeOutlineColor={primaryBlue}
                                    />
                                    {errors.endDate && touched.endDate && (
                                       <Text style={styles.errorText}>{errors.endDate}</Text>
                                    )}
                                 </View>
                              </View>

                              <TextInput
                                 mode="outlined"
                                 label={"Количество людей"}
                                 onChangeText={(text) => {
                                    handleChange("amount_of_people")(text);
                                    updateRoommateFields(text);
                                    // Инициализируем массив roommates нужной длины
                                    const count = Number(text);
                                    if (count > 1 && count <= 4) {
                                       setFieldValue("roommates", new Array(count - 1).fill(''));
                                    } else {
                                       setFieldValue("roommates", []);
                                    }
                                 }}
                                 onBlur={handleBlur("amount_of_people")}
                                 value={values.amount_of_people}
                                 style={{ marginTop: 8 }}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                                 keyboardType="numeric"
                              />
                              {errors.amount_of_people && touched.amount_of_people ? (
                                 <Text style={styles.errorText}>
                                    {errors.amount_of_people}
                                 </Text>
                              ) : null}

                              {roommateFields.map((_, index) => (
                                 <View key={index}>
                                    <TextInput
                                       mode="outlined"
                                       label={`Roommate ${index + 1} Email`}
                                       onChangeText={(text) => {
                                          const newRoommates = Array.isArray(values.roommates) ? [...values.roommates] : new Array(roommateFields.length).fill('');
                                          newRoommates[index] = text;
                                          setFieldValue('roommates', newRoommates);
                                       }}
                                       onBlur={handleBlur(`roommates.${index}`)}
                                       value={values.roommates?.[index] || ''}
                                       style={{ marginTop: 8 }}
                                       selectionColor={lightGray}
                                       cursorColor={primaryBlue}
                                       outlineColor={lightGray}
                                       activeOutlineColor={primaryBlue}
                                       outlineStyle={{ borderRadius: 4 }}
                                       keyboardType="email-address"
                                       autoCapitalize="none"
                                    />
                                    {errors.roommates?.[index] && touched.roommates?.[index] ? (
                                       <Text style={styles.errorText}>
                                          {typeof errors.roommates === 'string' ? errors.roommates : errors.roommates[index]}
                                       </Text>
                                    ) : null}
                                 </View>
                              ))}

                              <TextInput
                                 mode="outlined"
                                 label={"Reason"}
                                 onChangeText={handleChange("reason")}
                                 onBlur={handleBlur("reason")}
                                 value={values.reason}
                                 multiline
                                 numberOfLines={6}
                                 style={{ marginTop: 8 }}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                              />
                              {errors.reason && touched.reason ? (
                                 <Text style={styles.errorText}>
                                    {errors.reason}
                                 </Text>
                              ) : null}

                              <Button
                                 mode="contained"
                                 style={{
                                    width: "100%",
                                    borderRadius: 9,
                                    marginTop: 10,
                                 }}
                                 contentStyle={{
                                    height: 45,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                 }}
                                 buttonColor={primaryBlue}
                                 labelStyle={{
                                    fontFamily: "fontRegular",
                                    fontSize: 16
                                 }}
                                 onPress={handleSubmit}
                                 disabled={
                                    Object.keys(errors).length > 0 ||
                                    !values.startDate ||
                                    !values.endDate ||
                                    !values.amount_of_people ||
                                    !values.reason ||
                                    (Number(values.amount_of_people) > 1 && 
                                     (!values.roommates || values.roommates.length !== Number(values.amount_of_people) - 1))
                                 }
                              >
                                 {t("user.booking.newBooking")}
                              </Button>
                           </View>
                        );
                     }}
                  </Formik>
               </View>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: white,
   },
   contentContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
   },
   reqRoomTitle: {
      marginVertical: 8,
      fontFamily: "fontBold",
      fontSize: 18,
   },
   formContainer: {
      width: "90%",
   },
   form: {
      width: "100%",
   },
   errorText: {
      color: darkRed,
      fontFamily: "fontRegular",
      fontSize: 16,
      marginTop: 3,
   },
   datesWrapper: {
      width: '100%',
      marginBottom: 8,
   },
   dateContainer: {
      width: '100%',
      minHeight: 80,
      zIndex: 1,
   },
   dateInput: {
      backgroundColor: white,
      width: '100%',
   },
   modalContainer: {
      backgroundColor: white,
      padding: 20,
      margin: 20,
      borderRadius: 8,
   },
   modalTitle: {
      fontSize: 18,
      fontFamily: 'fontBold',
      marginBottom: 10,
   },
   modalText: {
      fontSize: 16,
      fontFamily: 'fontRegular',
      marginBottom: 20,
   },
   modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
   },
   modalButton: {
      minWidth: 100,
   },
});

export default Rooms;
