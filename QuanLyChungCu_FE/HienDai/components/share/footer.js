import { Avatar, Button, TextInput } from "react-native-paper";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import HomeScreen from "../Main/home";
import InfoUser from "./InfoUser";
const handleCall = () => {
    const phoneNumber = process.env.REACT_APP_PHONE; // Số điện thoại bạn muốn gọi
    Linking.openURL(`tel:${phoneNumber}`);
};
const Footer = () => {
    const nav = useNavigation();
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = React.useState(false);
    return (
        <View style={[styles.bottom]}>
            <View style={[styles.bottomIcon]}>
                <Button
                    style={[
                        styles.bottomF,
                        isPressed && styles.btnLoginfatherPressed,
                    ]}
                    loading={loading}
                    icon={"home"}
                    onPress={() => {
                        nav.navigate(HomeScreen);
                    }}
                ></Button>
            </View>
            <View style={[styles.bottomIcon]}>
                <Button
                    style={[
                        styles.bottomF,
                        isPressed && styles.btnLoginfatherPressed,
                    ]}
                    loading={loading}
                    icon={"phone"}
                    onPress={() => {
                        Alert.alert(
                            "Gọi cho ban quản lý",
                            "Có vấn đề cần được giải đáp?",
                            [
                                {
                                    text: "Không",
                                    style: "cancel",
                                },
                                {
                                    text: "gọi",
                                    onPress: () => {
                                        handleCall();
                                    },
                                },
                            ],
                            { cancelable: false }
                        );
                    }}
                ></Button>
            </View>
            <View style={[styles.bottomIcon]}>
                <Button
                    style={[
                        styles.bottomF,
                        isPressed && styles.btnLoginfatherPressed,
                    ]}
                    loading={loading}
                    icon={"account"}
                    onPress={() => {
                        nav.navigate(InfoUser);
                    }}
                ></Button>
            </View>
        </View>
    );
};

export default Footer;
