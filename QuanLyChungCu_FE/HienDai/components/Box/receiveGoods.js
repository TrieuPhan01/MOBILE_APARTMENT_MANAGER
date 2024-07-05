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
// import styles from "./styles";
// import * as React from "react";
// import { useState, useContext, useEffect } from "react";
// import Input from "../share/Input";
// import Hearder from "../share/Header";
// import axios from "axios";
// import APIs, { authAPI, endpoints } from "../../configs/APIs";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { MyUserContext } from "../../configs/Contexts";
// const ReceiveGoods = () => {
//     // const { item } = route.params;{ route }
//     const [loading, setLoading] = React.useState(false);
//     const [NameGoodss, setNameGoodss] = useState("");
//     const [NoteGoodss, setNoteGoodss] = useState("");
//     const [SizeGoodss, setSizeGoodss] = useState("");
//     const nav = useNavigation();
//     const user = useContext(MyUserContext);
//     // const payload = {
//     //     // id: item.id,
//     // };

//     // let esc = encodeURIComponent;
//     // let query = Object.keys(payload)
//     //     .map((k) => esc(k) + "=" + esc(payload[k]))
//     //     .join("&");

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
//                     <Hearder info={"Thông tin tủ đồ điện tử"} />
//                     <TouchableOpacity
//                         style={styles.TopBtn}
//                         title="Đăng ý nhận hàng"
//                         onPress={nav.navigate()}
//                     >
//                         <Input
//                             info={{
//                                 lable: "Nhập tên hàng",
//                                 icon: "gift-outline",
//                             }}
//                             onChangeText={(text) => setNameGoodss(text)}
//                         />
//                         <Input
//                             info={{
//                                 lable: "Nhập tên hàng",
//                                 icon: "gift-outline",
//                             }}
//                             onChangeText={(text) => setNoteGoodss(text)}
//                         />
//                         <Input
//                             info={{
//                                 lable: "Nhập tên hàng",
//                                 icon: "gift-outline",
//                             }}
//                             onChangeText={(text) => setSizeGoodss(text)}
//                         />
//                         <Text style={styles.TopBtnText}>Gửi</Text>
//                     </TouchableOpacity>
//                 </KeyboardAvoidingView>
//             </ScrollView>
//         </ImageBackground>
//     );
// };
// export default ReceiveGoods;
