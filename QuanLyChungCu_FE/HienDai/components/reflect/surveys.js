// import { Button, TextInput } from "react-native-paper";
// import {
//     ImageBackground,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StatusBar,
//     TouchableOpacity,
//     View,
//     Alert,
//     Text,
//     FlatList,
//     Image,
// } from "react-native";
// import styles from "./style";
// import * as React from "react";
// import { useState, useContext, useEffect } from "react";
// import Input from "../share/Input";
// import Hearder from "../share/Header";
// import axios from "axios";
// import APIs, { authAPI, endpoints } from "../../configs/APIs";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { MyUserContext } from "../../configs/Contexts";
// import Footer from "../share/footer";
// import { it } from "date-fns/locale/it";
// import HomeScreen from "../Main/home";
// import moment from "moment";
// import DetailSurveys from "./detailSurveys";
// const SurveysList = () => {
//     const nav = useNavigation();
//     const user = useContext(MyUserContext);
//     const [DataList, setDataList] = useState({});
//     useFocusEffect(
//         React.useCallback(() => {
//             fetchDataBox();
//         }, [])
//     );
//     const fetchDataBox = async () => {
//         try {
//             let res = await axios.get(
//                 "https://phanhoangtrieu.pythonanywhere.com/surveys/not-responded/"
//             );
//             console.log("getListSurvey: ", res.data);
//             setDataList(res.data);
//         } catch (ex) {
//             console.error(ex);
//             Alert.alert(
//                 "Lỗi",
//                 "Quay lại trang chủ",
//                 [
//                     {
//                         text: "OK",
//                         onPress: () => {
//                             nav.navigate("HomeScreen");
//                         },
//                     },
//                 ],
//                 { cancelable: false }
//             );
//         }
//     };

//     const renderItemGoodss = ({ item }) => (
//         <TouchableOpacity
//             style={[
//                 styles.backGroundItem,
//                 item.status ? {} : styles.disabledItem,
//             ]}
//             onPress={() => {
//                 nav.navigate("DetailSurveys", { id: item.survey_id });
//             }}
//             disabled={!item.status}
//         >
//             <View style={styles.infoContainer}>
//                 <Text style={styles.title}>Tiêu đề: {item.title}</Text>
//                 <Text style={styles.areaText}>
//                     Ngày tạo khảo sát:{" "}
//                     {moment(item.created_date).format("DD/MM/YYYY")}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//     );

//     return (
//         <ImageBackground
//             style={[styles.container]}
//             source={require("../../assets/backgrondLogin.png")}
//         >
//             <StatusBar barStyle={"light-content"} />
//             <ScrollView>
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === "ios" ? "padding" : "height"}
//                     style={styles.container}
//                 >
//                     <Hearder info={"Danh sách phiếu khảo sát"} />

//                     <FlatList
//                         data={DataList}
//                         keyExtractor={(item) => item.survey_id.toString()}
//                         renderItem={renderItemGoodss}
//                         style={[styles.ListItem]}
//                     />
//                 </KeyboardAvoidingView>
//             </ScrollView>
//         </ImageBackground>
//     );
// };
// export default SurveysList;
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
import styles from "./style";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import Input from "../share/Input";
import Hearder from "../share/Header";
import axios from "axios";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import Footer from "../share/footer";
import { it } from "date-fns/locale/it";
import HomeScreen from "../Main/home";
import moment from "moment";
import DetailSurveys from "./detailSurveys";

const SurveysList = () => {
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [DataList, setDataList] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            fetchDataBox();
        }, [])
    );

    const fetchDataBox = async () => {
        try {
            let res = await axios.get(
                "https://phanhoangtrieu.pythonanywhere.com/surveys/not-responded/",
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            console.log("res: ", res)
            if (res.data.length === 0) {
                Alert.alert(
                    "Không có phiếu cần khảo sát",
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
            } else setDataList(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert(
                "Lỗi",
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

    const renderItemGoodss = ({ item }) => {
        const isExpired = moment(item.end_date).isBefore(moment());
        return (
            <TouchableOpacity
                style={[
                    styles.backGroundItem,
                    isExpired ? styles.disabledItem : {},
                ]}
                onPress={() => {
                    if (!isExpired) {
                        nav.navigate("DetailSurveys", { id: item.id });
                    }
                }}
                disabled={isExpired}
            >
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>Tiêu đề: {item.title}</Text>
                    <Text style={styles.areaText}>
                        Ngày tạo khảo sát:{" "}
                        {moment(item.start_date).format("DD/MM/YYYY")}
                    </Text>
                    <Text style={styles.areaText}>
                        Ngày hết hạn khảo sát:{" "}
                        {moment(item.end_date).format("DD/MM/YYYY")}
                    </Text>
                    {isExpired && (
                        <Text style={styles.expiredText}>
                            Quá hạn chưa thực hiện
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
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
                    <Hearder info={"Danh sách phiếu khảo sát"} />

                    <FlatList
                        data={DataList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItemGoodss}
                        style={[styles.ListItem]}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
    );
};

export default SurveysList;
