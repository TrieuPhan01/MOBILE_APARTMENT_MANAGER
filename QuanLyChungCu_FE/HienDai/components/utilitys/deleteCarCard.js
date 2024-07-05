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
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import Footer from "../share/footer";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";

const DeleteCarCard = () => {
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [DataListCarCard, setDataListCarCard] = useState({});
  
    const fetchDataCarCard = async () => {
        try {
            let res = await APIs({
                method: "get",
                url: endpoints.ListCarCardOfUser,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setDataListCarCard(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert(
                "Không có thẻ xe",
                "Quay lại trang chủ",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            nav.navigate("HomeScreen");
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            fetchDataCarCard();
        }, [])
    );
    const renderItemCard = ({ item }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => {
                nav.navigate("DetailsScreen", { item });
            }}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={require("../../assets/loginHome.png")}
                    style={styles.image}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.complexName}>Hiền Vy Home</Text>
                <Text style={styles.areaText}>Khu vực gửi xe: {item.area}</Text>
                <Text style={styles.areaText}>
                    Loại xe: {item.vehicle_type}
                </Text>
                <Text style={styles.areaText}>
                    Ngày tạo: {moment(item.created_date).format("DD/MM/YYYY")}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            style={[styles.container]}
            source={require("../../assets/backgrondLogin.png")}
        >
            <StatusBar barStyle={"light-content"} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.containerin}
            >
                <Hearder info={"Danh sách thẻ xe đang sử dụng"} />
                <FlatList
                    data={DataListCarCard}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItemCard}
                />
            </KeyboardAvoidingView>

            <Footer />
        </ImageBackground>
    );
};

export default DeleteCarCard;
