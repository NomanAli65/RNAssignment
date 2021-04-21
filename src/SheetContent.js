import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");

export default SheetContent = (props) => {
    let data = props.data;
    let pic = data.picture?.large;
    let name_title = data.name?.title;
    let first_name = data.name?.first;
    let last_name = data.name?.last;
    let email = data.email;
    let phone = data.phone;
    return (
        <View style={styles.container}>
            <Image style={styles.ppic} source={{ uri: pic }} />
            <View style={styles.outerDetails}>
            <View style={styles.detailsCon}>
                <Ionicons name="person" color="#000" size={25} />
                <Text style={styles.details}>{name_title + " " + first_name + " " + last_name}</Text>
            </View>
            <View style={styles.detailsCon}>
                <Ionicons name="mail" color="#000" size={25} />
                <Text style={styles.details}>{email}</Text>
            </View>
            <View style={styles.detailsCon}>
                <Ionicons name="call" color="#000" size={25} />
                <Text style={styles.details}>{phone}</Text>
            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height,
        backgroundColor: "#fff",
        paddingVertical:20
    },
    ppic: {
        borderRadius: 150,
        height: 130,
        width: 130,
        backgroundColor:"#eee",
        alignSelf: 'center',
    },
    outerDetails:{
        alignSelf: 'center',
        flex:1,
        marginTop:20
    },
    detailsCon: {
        padding: 10,
        flexDirection:"row",
        backgroundColor:"#eee",
        borderRadius:5,
        marginVertical:3,
        alignItems: 'center',
    },
    details:{
        marginStart:10,
    }
})