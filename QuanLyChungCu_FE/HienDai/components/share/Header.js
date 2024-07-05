import { Avatar, TextInput } from "react-native-paper";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Hearder = (props) => {
    const ob = props.info;
    console.log(ob);
    const [isPressed, setIsPressed] = useState(false);
    const navigation = useNavigation();
    const backHome = () => {
        navigation.navigate("HomeScreen");
    };
    const goBack = () => {
        navigation.goBack();
    };
    return (
        <View>
            <View style={[styles.header]}>
                <View>
                    <TouchableOpacity style={[styles.goback]} onPress={goBack}>
                        <Text style={[styles.gobackText]}>{"<-"}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.nameHome]}>Hiền Vy Home</Text>

                <View style={[styles.ringNumber]}>
                    <Text style={[styles.ringNum]}>1</Text>
                </View>
                <View style={[styles.headerIconRight]}>
                    <TextInput.Icon
                        icon="bell-ring-outline"
                        color={"#ab9570"}
                        size={30}
                    />
                </View>
            </View>
            <View style={[styles.line]}>
                <Text style={[styles.inline]}>
                    ................................................................................................
                </Text>
            </View>
            <View style={[styles.hello]}>
                <View style={[styles.helloHeart]}>
                    <TextInput.Icon icon="heart" size={20} color={"#f3b15b"} />
                </View>
                <Text style={[styles.helloText]}>Xin chào</Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.introduceHome,
                    ,
                    isPressed && styles.btnPressedOpacity,
                ]}
                onPress={backHome}
            >
                <Avatar.Image
                    style={[styles.introduceHomeimg]}
                    size={40}
                    source={require("../../assets/loginHome.png")}
                />
                <View style={[styles.introduceHomeText]}>
                    <Text style={[styles.introduceHomeTextMain]}>
                        Khu chung cư Hiền Vy Home, Quận 1, TP.HCM
                    </Text>
                    <Text style={[styles.introduceHomeTextNote]}>
                        Hiền Vy Home
                    </Text>
                </View>
                <View style={[styles.introduceHomeIcon]}>
                    <TextInput.Icon
                        icon="menu-right"
                        size={50}
                        color={"#dcd3d1"}
                        style={[styles.introduceHomeInIcon]}
                    />
                </View>
            </TouchableOpacity>
            <View style={[styles.line]}>
                <Text style={[styles.inline]}>
                    ................................................................................................
                </Text>
            </View>
            <Text style={[styles.text]}>{ob}</Text>
        </View>
    );
};

export default Hearder;
