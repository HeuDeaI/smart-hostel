import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStackNavigator } from "@react-navigation/stack";

import Dashboard from "../../screens/app/user/Dashboard";
import Rooms from "../../screens/app/user/Rooms";
import ControlRoom from "../../screens/app/user/ControlRoom";
import Announcements from "../../screens/app/user/Announcements";
import Complains from "../../screens/app/user/Complains";
import Settings from "../../screens/app/user/Settings";
import Notifications from "../../screens/app/user/Notifications";
import PaymentReceipts from "../../screens/app/user/PaymentReceipts";
import HostelRules from "../../screens/app/user/HostelRules";
import HostelAdministration from "../../screens/app/user/HostelAdmininstration";
import ChatAI from "../../screens/app/user/ChatAI";
import OrderFood from "../../screens/app/user/OrderFood";
import CleanRoom from "../../screens/app/user/CleanRoom";
import AttractionDetails from "../../screens/app/user/AttractionDetails";

import RoomAcceptance from "../../screens/app/user/rooms/RoomAcceptance";
import ViewRoomAcceptance from "../../screens/app/user/rooms/ViewRoomAcceptance";
import RoomChecklistDetails from "../../screens/app/user/rooms/RoomChecklistDetails";
import ChangePassword from "../../screens/app/user/settings/ChangePassword";
import ChangeProfileDetails from "../../screens/app/user/settings/ChangeProfileDetails";
import ViewPaymentReceipt from "../../screens/app/user/payment_receipts/ViewPaymentReceipt";
import AddPaymentReceipt from "../../screens/app/user/payment_receipts/AddPaymentReceipt";
import AddNewComplain from "../../screens/app/user/complains/AddNewComplain";
import ViewComplain from "../../screens/app/user/complains/ViewComplain";
import ViewAnnouncement from "../../screens/app/user/announcements/ViewAnnouncement";

import RoomDetails from "../../screens/app/admin/rooms/RoomDetails";
import AddAnnouncement from "../../screens/app/admin/announcements/AddAnnouncement";
import RoomChecklistForm from "../../screens/app/admin/rooms/RoomChecklistForm";

const DashboardStack = createStackNavigator();
const RoomsStack = createStackNavigator();
const AnnouncementStack = createStackNavigator();
const ComplainsStack = createStackNavigator();
const HostelAdmininstrationStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const NotificationsStack = createStackNavigator();

export const UserDashboard = () => {
  return (
    <DashboardStack.Navigator
      initialRouteName="UserHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <DashboardStack.Screen name="UserHome" component={Dashboard} />
      <DashboardStack.Screen name="UserRoomsDashboard" component={UserRooms} />
      <DashboardStack.Screen name="UserControlRoom" component={ControlRoom} />
      <DashboardStack.Screen name="UserChatAI" component={ChatAI} />
      <DashboardStack.Screen name="UserOrderFood" component={OrderFood} />
      <DashboardStack.Screen name="UserCleanRoom" component={CleanRoom} />

      <DashboardStack.Screen
        name="UserRoomsAcceptanceDashboard"
        component={RoomAcceptance}
      />
      <DashboardStack.Screen
        name="UserPaymentReceiptsDashboard"
        component={PaymentReceipts}
      />
      <DashboardStack.Screen
        name="UserAddPaymentReceipts"
        component={AddPaymentReceipt}
      />
      <DashboardStack.Screen
        name="UserViewPaymentReceipts"
        component={ViewPaymentReceipt}
      />
      <DashboardStack.Screen
        name="UserComplainsDashboard"
        component={UserComplains}
      />
      <DashboardStack.Screen
        name="UserAddNewComplain"
        component={AddNewComplain}
      />
      <DashboardStack.Screen name="UserViewComplain" component={ViewComplain} />
      <DashboardStack.Screen
        name="UserHostelRulesDashboard"
        component={HostelRules}
      />

      <DashboardStack.Screen
        name="UserAnnouncementsDashboard"
        component={UserAnnouncements}
      />
      <DashboardStack.Screen
        name="UserViewAnnouncement"
        component={ViewAnnouncement}
      />

      <DashboardStack.Screen
        name="UserViewPaymentReceipt"
        component={ViewPaymentReceipt}
      />
      <DashboardStack.Screen
        name="UserNotifications"
        component={UserNotifications}
      />
      <DashboardStack.Screen
        name="AttractionDetails"
        component={AttractionDetails}
        options={{
          headerShown: true,
          title: "Достопримечательность",
        }}
      />
    </DashboardStack.Navigator>
  );
};

export const UserRooms = () => {
  return (
    <RoomsStack.Navigator
      initialRouteName="UserRooms"
      screenOptions={{
        headerShown: false,
      }}
    >
      <RoomsStack.Screen name="UserRooms" component={Rooms} />
      <RoomsStack.Screen
        name="UserRoomAcceptanceView"
        component={ViewRoomAcceptance}
      />
      <RoomsStack.Screen
        name="UserPendingRoomChecklist"
        component={RoomChecklistDetails}
      />
    </RoomsStack.Navigator>
  );
};

export const UserAnnouncements = () => {
  return (
    <AnnouncementStack.Navigator
      initialRouteName="UserAnnouncements"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AnnouncementStack.Screen
        name="UserAnnouncements"
        component={Announcements}
      />
      <AnnouncementStack.Screen
        name="UserAddAnnouncement"
        component={AddAnnouncement}
      />
      <AnnouncementStack.Screen
        name="UserViewAnnouncement"
        component={ViewAnnouncement}
      />
    </AnnouncementStack.Navigator>
  );
};

export const UserComplains = () => {
  return (
    <ComplainsStack.Navigator
      initialRouteName="UserComplains"
      screenOptions={{
        headerShown: false,
      }}
    >
      <ComplainsStack.Screen name="UserComplains" component={Complains} />
      <ComplainsStack.Screen name="UserViewComplain" component={ViewComplain} />
    </ComplainsStack.Navigator>
  );
};

export const UserHostelAdmininstration = () => {
  return (
    <HostelAdmininstrationStack.Navigator
      initialRouteName="UserHostelAdmininstration"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HostelAdmininstrationStack.Screen
        name="UserHostelAdmininstration"
        component={HostelAdministration}
      />
    </HostelAdmininstrationStack.Navigator>
  );
};

export const UserSettings = () => {
  return (
    <SettingsStack.Navigator
      initialRouteName="UserSettings"
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen name="UserSettings" component={Settings} />
      <SettingsStack.Screen
        name="UserChangeProfileDetails"
        component={ChangeProfileDetails}
      />
      <SettingsStack.Screen
        name="UserChangePassword"
        component={ChangePassword}
      />
    </SettingsStack.Navigator>
  );
};

export const UserNotifications = () => {
  return (
    <NotificationsStack.Navigator
      initialRouteName="UserNotificationsView"
      screenOptions={{
        headerShown: false,
      }}
    >
      <NotificationsStack.Screen
        name="UserNotificationsView"
        component={Notifications}
      />
    </NotificationsStack.Navigator>
  );
};
