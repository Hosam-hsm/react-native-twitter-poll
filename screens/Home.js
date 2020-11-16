import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import { BLUE } from "../../constants";
import { useStore } from "../store";
import { Post } from "../components";

const ItemSeperator = () => {
    return (
        <View style={{
            height: 1,
            backgroundColor: 'lightgrey'
        }} />
    )
}

const CreatePostButton = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: BLUE,
                alignItems: "center",
                justifyContent: "center",
                position: 'absolute',
                bottom: 10,
                right: 10,
                zIndex: 10,
                elevation: 5,
            }}
            onPress={() => navigation.navigate('TwitterPollCreate')}
        >
            <MaterialCommunityIcons
                name="pen"
                size={25}
                color="#fff"
            />
        </TouchableOpacity>
    )
}

const Home = ({ }) => {
    const store = useStore()

    useEffect(() => {
        //fetch the posts here from getPosts API
    }, [])
    return (
        <View style={styles.container}>
            <FlatList
                data={store.posts}
                contentContainerStyle={{ paddingBottom: 60 }}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ItemSeperator}
                renderItem={({ item }) => <Post key={item.id} post={item} />}
            />
            <CreatePostButton />
        </View>
    )
};
export default observer(Home);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})