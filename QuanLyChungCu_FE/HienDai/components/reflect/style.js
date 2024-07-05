import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    ListItem: {
        width: "90%",
        alignSelf: "center",
    },
    backGroundItem: {
        backgroundColor: "#fff",
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 20,
        padding: 20,
    },
    infoContainer: {
        alignSelf: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    boxtitles: {
        alignItems: "center",
        marginTop: 20,
    },
    titles: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    mar: {
        marginBottom: 20,
    },
    disabledItem: {
        backgroundColor: "#f0f0f0",
    },
    expiredText: {
        color: "red",
    },
});
