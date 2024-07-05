// Import necessary components and functions
import React, { useEffect, useState, useReducer } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./components/Login/login";
import HomeScreen from "./components/Main/home";
import ForgotAccountScreen from "./components/Login/forgotAccount";
import ChangInfo from "./components/Main/changInfo";
import EditPass from "./components/Main/editPass";
import Service from "./components/utilitys/Service";
import Input from "./components/share/Input";
import Header from "./components/share/Header";
import Card from "./components/utilitys/Card";
import DeleteCarCard from "./components/utilitys/deleteCarCard";
import Footer from "./components/share/footer";
import InfoUser from "./components/share/InfoUser";
import DetailsScreen from "./components/utilitys/DetailsScreen";
import Uses from "./components/utilitys/Uses";
import ViewGoodss from "./components/Box/view";
import PaymentScreen from "./components/Payment/pay";
import BankPayScreen from "./components/BankPay/bankpay";
import BillPaidScreen from "./components/Payment/billpaid";
import SeeDetail from "./components/SeeDetals/seedetal";
import CreateGoodss from "./components/Box/creategoodss";
import Ideally from "./components/ideally/ideally";
import IdeaPrivate from "./components/ideally/ideaPrivate";

import { MyDispatcherContext, MyUserContext } from "./configs/Contexts";
import { MyUserReducer } from "./configs/Reducers";

import GoHome from "./components/traffic/goHome";
import SurveysList from "./components/reflect/surveys";
import DetailSurveys from "./components/reflect/detailSurveys";
import Chat from "./components/ChatRealTime/chat";
import ReflectScreen from "./components/reflect/reflect";

import MapScr from "./components/traffic/map";

const Stack = createNativeStackNavigator();

const MyStack = ({ userToken }) => {
    return (
        <Stack.Navigator
            initialRouteName={userToken ? "Home" : "Login"}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
                name="ForgotAccount"
                component={ForgotAccountScreen}
            />
            <Stack.Screen name="ChangInfo" component={ChangInfo} />
            <Stack.Screen name="EditPass" component={EditPass} />
            <Stack.Screen name="ViewGoodss" component={ViewGoodss} />
            <Stack.Screen name="CreateGoodss" component={CreateGoodss} />
            <Stack.Screen name="InfoUser" component={InfoUser} />
            <Stack.Screen name="Service" component={Service} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="MapScr" component={MapScr} />
            <Stack.Screen name="GoHome" component={GoHome} />
            <Stack.Screen name="SurveysList" component={SurveysList} />
            <Stack.Screen name="DetailSurveys" component={DetailSurveys} />
            <Stack.Screen name="Ideally" component={Ideally} />
            <Stack.Screen name="Card" component={Card} />
            <Stack.Screen name="DeleteCarCard" component={DeleteCarCard} />
            <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
            <Stack.Screen name="IdeaPrivate" component={IdeaPrivate} />
            <Stack.Screen name="Uses" component={Uses} />
            <Stack.Screen name="Input" component={Input} />
            <Stack.Screen name="Header" component={Header} />
            <Stack.Screen name="Footer" component={Footer} />
            <Stack.Screen name="BankPayScreen" component={BankPayScreen} />
            <Stack.Screen name="BillPaidScreen" component={BillPaidScreen} />
            <Stack.Screen name="SeeDetail" component={SeeDetail} />

            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="ReflectScreen" component={ReflectScreen} />
        </Stack.Navigator>
    );
};

// Define App component
const App = () => {
    const [user, dispatcher] = useReducer(MyUserReducer, null);
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token");
                setUserToken(token);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    if (isLoading) {
        // Show loading indicator while checking login status
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <MyUserContext.Provider value={user}>
                <MyDispatcherContext.Provider value={dispatcher}>
                    <MyStack userToken={userToken} />
                </MyDispatcherContext.Provider>
            </MyUserContext.Provider>
        </NavigationContainer>
    );
};

export default App;
