import { Avatar, Button, TextInput } from "react-native-paper";
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
} from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState, useContext } from "react";
import Input from "../share/Input";
import Hearder from "../share/Header";
import APIs, { endpoints } from "../../configs/APIs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MyDispatcherContext, MyUserContext } from "../../configs/Contexts";
import Footer from "../share/footer";
import HomeScreen from "../Main/home";
import moment from "moment";

const InfoUser = () => {
    const [isPressed, setIsPressed] = useState(false);
    const [area, setArea] = useState("");
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [dataPeople, setDataPeople] = useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const avatar = user ? user.avatar_acount : "";
    const [avatarchang, setAvatarchang] = useState("");
    console.log("avatar ở info: ", user);
    const dispatcher = useContext(MyDispatcherContext);

    const fetchDataInforUsser = async () => {
        try {
            let res = await APIs({
                method: "get",
                url: endpoints.getPeople,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setDataPeople(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert(
                "Chưa có người dùng sử dụng tài khoản",
                "Quay về trang chủ",
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
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            fetchDataInforUsser();
        }, [])
    );
    // -----------------------------------------------------------------------------
    const handleLogout = () => {
        dispatcher({
            type: "logout",
        });

        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Không",
                    style: "cancel",
                },
                {
                    text: "Đăng xuất",
                    onPress: async () => {
                        nav.replace("Login");
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const picker = async () => {
        let { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) setAvatarchang(result.assets[0]);
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
                    <Hearder info={"Thông tin cá nhân"} />
                    <View style={styles.contentContainer}>
                        <TouchableOpacity onPress={picker}>
                            <Avatar.Image
                                size={44}
                                source={{ uri: avatar }}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Họ và tên: </Text>
                            <Text style={styles.value}>
                                {dataPeople.name_people}
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Ngày sinh: </Text>
                            <Text style={styles.value}>
                                {moment(dataPeople.birthday).format(
                                    "DD/MM/YYYY"
                                )}
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Giới tính: </Text>
                            <Text style={styles.value}>{dataPeople.sex}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Số điện thoại: </Text>
                            <Text style={styles.value}>{dataPeople.phone}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Ngày hết hạn: </Text>
                            <Text style={styles.value}>
                                {dataPeople.expiry}
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Số căn hộ: </Text>
                            <Text style={styles.value}>
                                {dataPeople.ApartNum}
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>CMND/CCCD: </Text>
                            <Text style={styles.value}>
                                {dataPeople.identification_card}
                            </Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <Button
                mode="contained"
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                Đăng xuất
            </Button>
            <Footer />
        </ImageBackground>
    );
};
export default InfoUser;
