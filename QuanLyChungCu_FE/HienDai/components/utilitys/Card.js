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
} from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState, useContext } from "react";
import Input from "../share/Input";
import Hearder from "../share/Header";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import Footer from "../share/footer";

const Card = () => {
    const [isPressed, setIsPressed] = useState(false);
    const [area, setArea] = useState("");
    const [vehicle_type, setVehicle_type] = useState("");
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const CardCar = async () => {
        setLoading(true);
        if ((vehicle_type == 1 || vehicle_type == 2) && area != "") {
            if (vehicle_type == 1) {
                const payload = {
                    area: area,
                    vehicle_type: "Xe máy",
                };
                console.log("Thẻ xe khi thêm payload: ", payload);
                let esc = encodeURIComponent;
                let query = Object.keys(payload)
                    .map((k) => esc(k) + "=" + esc(payload[k]))
                    .join("&");

                console.log("Thẻ xe khi thêm: ", query);

                try {
                    let res = await APIs({
                        method: "post",
                        url: endpoints.carCard,
                        withCredentials: true,
                        crossdomain: true,
                        data: query,
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    if (res.status === 201) {
                        Alert.alert(
                            "Đăng kí thành công",
                            "Gửi xét duyệt thành công",
                            [
                                {
                                    text: "OK",
                                    onPress: () => nav.navigate("HomeScreen"),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                } catch (ex) {
                    Alert.alert(
                        "Không thành công",
                        "Số lượng thẻ vượt quá giới hạn, xoá bớt",
                        [
                            {
                                text: "OK",
                                onPress: () => nav.navigate("DeleteCarCard"),
                            },
                        ],
                        { cancelable: false }
                    );
                } finally {
                    setLoading(false);
                }
                console.log("Hãy log ra: ");
            } else {
                const payload = {
                    area: area,
                    vehicle_type: "Xe ô tô",
                };
                let esc = encodeURIComponent;
                let query = Object.keys(payload)
                    .map((k) => esc(k) + "=" + esc(payload[k]))
                    .join("&");

                try {
                    let res = await APIs({
                        method: "post",
                        url: endpoints.carCard,
                        withCredentials: true,
                        crossdomain: true,
                        data: query,
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    if (res.status === 201) {
                        Alert.alert(
                            "Đăng kí thành công",
                            "Gửi xét duyệt thành công",
                            [
                                {
                                    text: "OK",
                                    onPress: () => nav.navigate("HomeScreen"),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                } catch (ex) {
                    Alert.alert(
                        "Không thành công",
                        "Số lượng thẻ vượt quá giới hạn, xoá bớt",
                        [
                            {
                                text: "OK",
                                onPress: () => nav.navigate("DeleteCarCard"),
                            },
                        ],
                        { cancelable: false }
                    );
                } finally {
                    setLoading(false);
                }
            }
        } else {
            Alert.alert(
                "Nhập thiếu tên khu vực hoặc sai loại xe",
                "Nhập tên khu vực và loại xe 1 hoặc 2",
                [
                    {
                        text: "OK",
                        onPress: () => nav.navigate("Card"),
                    },
                ],
                { cancelable: false }
            );
            setLoading(false);
        }
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
                    <Hearder info={"Đăng kí thẻ gửi xe"} />
                    <Input
                        info={{
                            lable: "Nhập khu đăng kí thẻ gửi xe",
                            icon: "car",
                        }}
                        onChangeText={(text) => setArea(text)}
                    />
                    <Input
                        info={{
                            lable: "1: Xe máy, 2: Xe ô tô. Ví dụ: 1",
                            icon: "car",
                        }}
                        onChangeText={(text) => setVehicle_type(text)}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={[styles.btnLoginChildP]}>
                <Button
                    style={[isPressed && styles.btnLoginfatherPressed]}
                    loading={loading}
                    icon={"account"}
                    onPress={CardCar}
                >
                    Gửi xét duyệt
                </Button>
            </View>
            <Footer />
        </ImageBackground>
    );
};

export default Card;
