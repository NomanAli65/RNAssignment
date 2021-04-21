import React from 'react';
import { Image, Text, View } from 'react-native';


export default SheetContent=(props)=>{
    let data=props.data;
    let pic = data.picture?.thumbnail;
    let name_title=data.name?.title;
    let first_name=data.name?.first;
    let last_name=data.name?.last;
    let email=data.name?.email;
    let phone=data.name?.phone;
    
    return(
        <View style={{flex:1}}>
            <Image style={{borderRadius:150,height:250,width:250}} source={{uri:pic}} />
            <View style={styles.details}>
            <Text>{name_title+" "+first_name+" "+last_name}</Text>
            </View>
            <View style={styles.details}>
            <Text>{email}</Text>
            </View>
            <View style={styles.details}>
            <Text>{phone}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    img: {
        flex: 1,
        width: "90%",
        resizeMode: "contain",
    },
    details: {
        padding: 5,
    }
})