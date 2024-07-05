import { Button, TextInput } from "react-native-paper";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
    Alert,
    Text,
    FlatList,
    Image,
} from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import Input from "../share/Input";
import Hearder from "../share/Header";
import axios from "axios";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import Footer from "../share/footer";
import { it } from "date-fns/locale/it";
import HomeScreen from "../Main/home";
const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [loading, setLoading] = React.useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const payload = {
        id: item.id,
    };

    let esc = encodeURIComponent;
    let query = Object.keys(payload)
        .map((k) => esc(k) + "=" + esc(payload[k]))
        .join("&");

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận",
            `Bạn có chắn chắn muốn xoá thẻ xe ${item.id}?`,
            [
                {
                    text: "Không",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        console.log(query);
                        try {
                            let res = await APIs({
                                method: "delete",
                                url: endpoints.deleteCarCard,
                                data: payload,
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                    "Content-Type": "application/json",
                                },
                            });
                            if (res.status === 200) {
                                nav.navigate("DeleteCarCard");
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert(
                                "Xoá lỗi",
                                "Quay lại trang chủ",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            nav.navigate(HomeScreen);
                                        },
                                    },
                                ],
                                { cancelable: false }
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
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
                    <Hearder info={"Thông tin thẻ xe"} />
                    <View style={styles.containerText}>
                        <Text style={styles.title}> {item.id}</Text>
                        <Text style={styles.text}>Khu vực: {item.area}</Text>
                        <Text style={styles.text}>
                            Ngày tạo: {item.created_date}
                        </Text>
                        <Text style={styles.text}>
                            Loại xe: {item.vehicle_type}
                        </Text>
                        <Button
                            style={styles.bottomBtn}
                            title="Xoá thẻ"
                            onPress={handleDelete}
                        >
                            Xoá thẻ xe
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
    );
};
export default DetailsScreen;
