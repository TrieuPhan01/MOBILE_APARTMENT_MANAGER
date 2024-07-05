import { Avatar, Text, TextInput } from "react-native-paper";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Hearder from "../share/Header";
import Footer from "../share/footer";

const Ideally = () => {
    const [isPressed, setIsPressed] = useState(false);
    const nav = useNavigation();
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
                    <Hearder info={"Phản ánh"} />
                    <View style={[styles.utilities]}>
                        <View style={[styles.utilitiesTow]}>
                            <TouchableOpacity
                                style={[
                                    styles.utilitiesChild,
                                    isPressed && styles.btnPressedOpacity,
                                ]}
                                onPress={() => {
                                    nav.navigate("IdeaPrivate");
                                }}
                            >
                                <TextInput.Icon
                                    icon="email-newsletter"
                                    size={34}
                                    color={"#dcd3d1"}
                                    style={[styles.utilitiesIcon]}
                                />
                                <Text style={[styles.utilitiesText]}>
                                    Kín đến Ban Quản Lý
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.utilitiesChild,
                                    isPressed && styles.btnPressedOpacity,
                                ]}
                                onPress={() => {
                                    nav.navigate("Card");
                                }}
                            >
                                <TextInput.Icon
                                    icon="earth"
                                    size={34}
                                    color={"#dcd3d1"}
                                    style={[styles.utilitiesIcon]}
                                />
                                <Text style={[styles.utilitiesText]}>
                                    Công khai
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <Footer />
        </ImageBackground>
    );
};

export default Ideally;
