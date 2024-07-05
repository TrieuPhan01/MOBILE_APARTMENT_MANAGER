import { Avatar, Text, TextInput } from "react-native-paper";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import myStyles from "../../Styles/myStyles";
import styles from "./style";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import { login } from "./../../configs/login_api";
import { MyUserContext, MyDispatcherContext } from "../../configs/Contexts";
import Footer from "./../share/footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import PaymentScreen from "../Payment/pay";
import Hearder from "../share/Header";
import * as Location from "expo-location";
import GoHome from "./goHome";

const MapScr = () => {
    const user = useContext(MyUserContext);
    const dispatcher = useContext(MyDispatcherContext);
    const navigation = useNavigation();
    const handleOpenGoogleMaps = () => {
        navigation.navigate(GoHome);
    };

    return (
        <ImageBackground
            style={[styles.container]}
            source={require("../../assets/backgrondLogin.png")}
        >
            <StatusBar barStyle={"light-content"} />
            <ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <Hearder />
                    <TouchableOpacity
                        style={styles.btnchua}
                        onPress={handleOpenGoogleMaps}
                    >
                        <Text style={styles.textBtn}>Đường về chung cư</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
            <Footer />
        </ImageBackground>
    );
};

export default MapScr;
