import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        alignItems: 'center',
    },
    option: {
        alignItems: 'center',
        marginTop: 20,
    },
    back: {
        marginTop: 40,
        marginLeft: 20,
        justifyContent: 'center',
    },
    button_back :{
        backgroundColor: '#232227',
        width: 40,
        height: 40,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        position: "relative"
    },
    backArrow: {
        color: '#e5e5e5',
        fontWeight: '400',
        fontSize: 35,
        position: 'absolute',
        top: -6,
        left: 5,
    },
    input: {
        alignItems: 'center',
    },
    submit: {
        alignItems: 'center',
        margin: 20,
        marginBottom: 30,
    },
    fqa: {
        color: '#94908f',
        fontSize: 11,
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 18,
        marginHorizontal: 5,
    },
    button_change_method :{
        backgroundColor: '#232227',
        padding: 6,
        borderRadius: 30,
        marginBottom: 5,
        paddingHorizontal: 15,
    },
    text_input: {
        width: 320,
        borderRadius: 15,
        fontSize: 18,
        color: '#fff',
        backgroundColor: '#232227',
        paddingLeft: 20,
    },
    button_continue :{
        backgroundColor: '#232227',
        borderRadius: 30,
        paddingHorizontal: 110,
        paddingVertical: 15,
    },
});

export default styles;