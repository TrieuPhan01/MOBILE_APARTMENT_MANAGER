// import { ActivityIndicator, Button, TextInput } from "react-native-paper";
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
// import styles from "./styles";
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
// import CreateGoodss from "./creategoodss";
// import moment from "moment";
// const ViewGoodss = () => {
//     const [reload, setReload] = useState(false);
//     const nav = useNavigation();
//     const user = useContext(MyUserContext);
//     const [DataListBox, setDataListBox] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [page, setPage] = React.useState(1);
//     useFocusEffect(
//         React.useCallback(() => {
//             fetchDataBox();
//         }, [reload, page])
//     );
//     const fetchDataBox = async () => {
//         setLoading(true);
//         try {
//             let res = await APIs({
//                 method: "get",
//                 url: `${endpoints.ListGoodssOfUser}?page=${page}`,
//                 headers: {
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             });
//             console.log("res: ", res.data);
//             if (page == 1) setDataListBox(res.data.results);
//             else if (page > 1)
//                 setDataListBox((curennt) => {
//                     return [...curennt, ...res.data.results];
//                 });
//         } catch (ex) {
//             console.error(ex);
//             Alert.alert(
//                 "Xoá lỗi",
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
//         } finally {
//             setLoading(false);
//         }
//     };
//     console.log("DataListBox: ", DataListBox);
//     const getBackgroundColor = (receivedGoods) => {
//         switch (receivedGoods) {
//             case "Chờ nhận hàng":
//                 return "#FFCCCC"; // Màu đỏ nhạt
//             case "Đã lấy hàng":
//                 return "#FFFF99"; // Màu vàng nhạt
//             case "Người dùng đã nhận được hàng":
//                 return "#CCFFCC"; // Màu xanh lá cây nhạt
//             default:
//                 return "#FFFFFF"; // Màu trắng (mặc định)
//         }
//     };
//     const changeStatus = async ({ item }) => {
//         try {
//             let res = await APIs({
//                 method: "patch",
//                 url: endpoints.changeStatusGoods(item.id),
//                 headers: {
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             });
//             setDataListBox((prev) => {
//                 const newDataListBox = prev.map((data) => {
//                     if (data.id == item.id) {
//                         data.received_Goods = "Người dùng đã nhận được hàng";
//                     }
//                     return data;
//                 });

//                 return newDataListBox;
//             });
//         } catch (ex) {
//             Alert.alert(
//                 "Cập nhập trạng thái bị lỗi",
//                 "Lỗi",
//                 [
//                     {
//                         text: "OK",
//                         // onPress: () => {
//                         //     nav.navigate("HomeScreen");
//                         // },
//                     },
//                 ],
//                 { cancelable: false }
//             );
//         }
//     };
//     const isCloseToBottom = ({
//         layoutMeasurement,
//         contentOffset,
//         contentSize,
//     }) => {
//         const paddingToBottom = 20;
//         return (
//             layoutMeasurement.height + contentOffset.y >=
//             contentSize.height - paddingToBottom
//         );
//     };
//     const loadMore = ({ nativeEvent }) => {
//         if (!loading && isCloseToBottom(nativeEvent)) setPage(page + 1);
//     };
//     const renderItemGoodss = ({ item }) => (
//         <TouchableOpacity
//             style={[
//                 styles.cardContainer,
//                 {
//                     backgroundColor: getBackgroundColor(item.received_Goods),
//                 },
//             ]}
//             onPress={() => {
//                 if (item.received_Goods === "Đã lấy hàng") {
//                     Alert.alert(
//                         "Bạn đã nhận được hàng?",
//                         " ",
//                         [
//                             {
//                                 text: "Chưa",
//                                 style: "cancel",
//                             },
//                             {
//                                 text: "Rồi",
//                                 onPress: () => {
//                                     changeStatus({ item });
//                                 },
//                             },
//                         ],
//                         { cancelable: false }
//                     );
//                 } else {
//                     // Có thể hiển thị thông báo hoặc thực hiện hành động khác nếu cần
//                     console.log("Không thể nhấn vào item này");
//                 }
//             }}
//         >
//             <View style={styles.imageContainer}>
//                 <Image source={{ uri: item.img_goods }} style={styles.image} />
//             </View>
//             <View style={styles.infoContainer}>
//                 <Text style={styles.complexName}>
//                     Tên hàng: {item.name_goods}
//                 </Text>
//                 <Text style={styles.areaText}>Kích thước: {item.size}</Text>
//                 <Text style={styles.areaText}>
//                     Ngày nhận: {moment(item.created_date).format("DD/MM/YYYY")}
//                 </Text>
//                 <Text style={styles.areaText}>
//                     Trạng thái: {item.received_Goods}
//                 </Text>
//                 {item.received_Goods === "Đã lấy hàng" && (
//                     <Text style={styles.thank}>
//                         Xác nhận đã lấy hàng khỏi tủ đồ
//                     </Text>
//                 )}
//             </View>
//         </TouchableOpacity>
//     );

//     return (
//         <ImageBackground
//             style={[styles.container]}
//             source={require("../../assets/backgrondLogin.png")}
//         >
//             <StatusBar barStyle={"light-content"} />
//             <ScrollView onScroll={loadMore}>
//                 {loading && <ActivityIndicator />}
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === "ios" ? "padding" : "height"}
//                     style={styles.container}
//                 >
//                     <Hearder info={"Thông tin tủ đồ điện tử"} />
//                     <View style={styles.containerText}>
//                         <TouchableOpacity
//                             style={styles.TopBtn}
//                             title="Đăng ý nhận hàng"
//                             onPress={() => {
//                                 nav.navigate(CreateGoodss);
//                             }}
//                         >
//                             <Text style={styles.TopBtnText}>
//                                 + Đăng kí nhận hàng
//                             </Text>
//                         </TouchableOpacity>
//                         <Text style={styles.titlelist}>
//                             Hàng đã đăng kí nhận
//                         </Text>
//                         <FlatList
//                             data={DataListBox}
//                             keyExtractor={(item) => item.id.toString()}
//                             renderItem={renderItemGoodss}
//                         />
//                     </View>
//                 </KeyboardAvoidingView>
//                 {loading && page > 1 && <ActivityIndicator />}
//             </ScrollView>
//         </ImageBackground>
//     );
// };
// export default ViewGoodss;
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import Footer from "../share/footer";
import { it } from "date-fns/locale/it";
import HomeScreen from "../Main/home";
import CreateGoodss from "./creategoodss";
import moment from "moment";

const ViewGoodss = () => {
    const [reload, setReload] = useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [DataListBox, setDataListBox] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchDataBox();
        }, [reload, page])
    );

    const fetchDataBox = async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            let res = await APIs({
                method: "get",
                url: `${endpoints.ListGoodssOfUser}?page=${page}`,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            console.log("res: ", res.data);

            if (page === 1) {
                setDataListBox(res.data.results);
            } else {
                setDataListBox((current) => [...current, ...res.data.results]);
            }

            if (res.data.next === null) {
                setHasMore(false);
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert(
                "Xoá lỗi",
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
        } finally {
            setLoading(false);
        }
    };

    console.log("DataListBox: ", DataListBox);

    const getBackgroundColor = (receivedGoods) => {
        switch (receivedGoods) {
            case "Chờ nhận hàng":
                return "#FFCCCC"; // Màu đỏ nhạt
            case "Đã lấy hàng":
                return "#FFFF99"; // Màu vàng nhạt
            case "Người dùng đã nhận được hàng":
                return "#CCFFCC"; // Màu xanh lá cây nhạt
            default:
                return "#FFFFFF"; // Màu trắng (mặc định)
        }
    };

    const changeStatus = async ({ item }) => {
        try {
            let res = await APIs({
                method: "patch",
                url: endpoints.changeStatusGoods(item.id),
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setDataListBox((prev) => {
                const newDataListBox = prev.map((data) => {
                    if (data.id == item.id) {
                        data.received_Goods = "Người dùng đã nhận được hàng";
                    }
                    return data;
                });

                return newDataListBox;
            });
        } catch (ex) {
            Alert.alert(
                "Cập nhập trạng thái bị lỗi",
                "Lỗi",
                [
                    {
                        text: "OK",
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const isCloseToBottom = ({
        layoutMeasurement,
        contentOffset,
        contentSize,
    }) => {
        const paddingToBottom = 20;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };

    const loadMore = ({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent) && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const renderItemGoodss = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.cardContainer,
                {
                    backgroundColor: getBackgroundColor(item.received_Goods),
                },
            ]}
            onPress={() => {
                if (item.received_Goods === "Đã lấy hàng") {
                    Alert.alert(
                        "Bạn đã nhận được hàng?",
                        " ",
                        [
                            {
                                text: "Chưa",
                                style: "cancel",
                            },
                            {
                                text: "Rồi",
                                onPress: () => {
                                    changeStatus({ item });
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                } else {
                    console.log("Không thể nhấn vào item này");
                }
            }}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.img_goods }} style={styles.image} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.complexName}>
                    Tên hàng: {item.name_goods}
                </Text>
                <Text style={styles.areaText}>Kích thước: {item.size}</Text>
                <Text style={styles.areaText}>
                    Ngày nhận: {moment(item.created_date).format("DD/MM/YYYY")}
                </Text>
                <Text style={styles.areaText}>
                    Trạng thái: {item.received_Goods}
                </Text>
                {item.received_Goods === "Đã lấy hàng" && (
                    <Text style={styles.thank}>
                        Xác nhận đã lấy hàng khỏi tủ đồ
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            style={[styles.container]}
            source={require("../../assets/backgrondLogin.png")}
        >
            <StatusBar barStyle={"light-content"} />
            <ScrollView onScroll={loadMore}>
                {loading && <ActivityIndicator />}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <Hearder info={"Thông tin tủ đồ điện tử"} />
                    <View style={styles.containerText}>
                        <TouchableOpacity
                            style={styles.TopBtn}
                            title="Đăng ý nhận hàng"
                            onPress={() => {
                                nav.navigate(CreateGoodss);
                            }}
                        >
                            <Text style={styles.TopBtnText}>
                                + Đăng kí nhận hàng
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.titlelist}>
                            Hàng đã đăng kí nhận
                        </Text>
                        <FlatList
                            data={DataListBox}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItemGoodss}
                        />
                    </View>
                </KeyboardAvoidingView>
                {loading && page > 1 && <ActivityIndicator />}
            </ScrollView>
        </ImageBackground>
    );
};

export default ViewGoodss;
