import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: "#f5f5f5",
    },
    card: {
        margin: 10,
        borderRadius: 10,
        position: "relative",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginRight: 2,
        textAlign: "left",
        flex: 1,
    },
    textBoard: { fontSize: 20, marginBottom: 30 },
    textBoard: {
        fontSize: 20,
        marginBottom: 10,
    },
    transactionImage: {
        width: "100%",
        height: 350,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 20,
    },
    totalText_bank: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    headers: {
        backgroundColor: "transparent",
        elevation: 0, // Remove shadow on Android
    },

    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        width: "100%",
    },

    value: {
        textAlign: "left",
        marginLeft: 3,
        color: "#ff61bb",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "left",
        flex: 1,
    },
});
