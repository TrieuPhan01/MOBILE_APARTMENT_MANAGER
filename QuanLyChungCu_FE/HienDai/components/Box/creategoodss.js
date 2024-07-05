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
    Linking,
} from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import Input from "../share/Input";
import Hearder from "../share/Header";
import axios from "axios";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import HomeScreen from "../Main/home";
import Footer from "../share/footer";
import ViewGoodss from "./view";
const CreateGoodss = () => {
    // const { item } = route.params;{ route }
    const [loading, setLoading] = React.useState(false);
    const [NameGoodss, setNameGoodss] = useState("");
    const [NoteGoodss, setNoteGoodss] = useState("");
    const [SizeGoodss, setSizeGoodss] = useState("");
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const handleCall = () => {
        const phoneNumber = process.env.REACT_APP_PHONE; // Số điện thoại bạn muốn gọi
        Linking.openURL(`tel:${phoneNumber}`);
    };
    const send = async () => {
        if (NameGoodss && NoteGoodss && SizeGoodss) {
            setLoading(true);

            const payload = {
                name_goods: NameGoodss,
                note: NoteGoodss,
                size: SizeGoodss,
            };
            console.log("Dữ liệu đăng kí nhận hàng (payload): ", payload);
            let esc = encodeURIComponent;
            let query = Object.keys(payload)
                .map((k) => esc(k) + "=" + esc(payload[k]))
                .join("&");

            console.log("Dữ liệu đăng kí nhận hàng (query): ", query);

            try {
                let res = await APIs({
                    method: "post",
                    url: endpoints.createGoodss,
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
                        "Về trang chủ",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    nav.navigate(HomeScreen)
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (ex) {
                console.error(ex);
                if (ex.response.status === 400) {
                    Alert.alert(
                        "Bạn chưa có tủ đồ điện tử",
                        "Liên lạc với ban quản lý",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    handleCall();
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert(
                "Bạn chưa nhập đủ thông tin",
                "Kiểm tra lại",
                [
                    {
                        text: "OK",
                        onPress: () => nav.navigate(CreateGoodss),
                    },
                ],
                { cancelable: false }
            );
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
                    <Hearder info={"Nhập thông tin hàng hoá"} />
                    <View style={[styles.containerText, styles.padding]}>
                        <Input
                            info={{
                                lable: "Nhập tên hàng",
                                icon: "gift-outline",
                            }}
                            onChangeText={(text) => setNameGoodss(text)}
                        />
                        <Input
                            info={{
                                lable: "Kích cỡ hàng hoá",
                                icon: "emoticon-happy-outline",
                            }}
                            
                            onChangeText={(text) => setNoteGoodss(text)}
                        />
                        <Input
                            info={{
                                lable: "Ghi chú",
                                icon: "note-edit-outline",
                            }}
                            onChangeText={(text) => setSizeGoodss(text)}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <TouchableOpacity
                style={[styles.TopBtn, styles.margin, styles.color]}
                title="Gửi"
                onPress={send}
            >
                <Text style={styles.TopBtnText}>Gửi</Text>
            </TouchableOpacity>
            <Footer />
        </ImageBackground>
    );
};
export default CreateGoodss;
