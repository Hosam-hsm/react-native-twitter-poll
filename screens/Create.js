import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Image,
    Button,
} from "react-native";
import { observer } from "mobx-react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PollChoices } from "../components";
import { useStore } from "../store";

const Create = ({ }) => {
    const [question, setQuestion] = useState(undefined)
    const [show, setShow] = useState(false);
    const store = useStore()

    useEffect(() => {
        store.setQuestion(question)
    }, [question])

    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={styles.container}>
            <View style={styles.tweetContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: store.user.image }} style={styles.image} />
                </View>
                <TextInput
                    multiline
                    style={styles.textInput}
                    value={question}
                    onChangeText={setQuestion}
                    placeholderTextColor={'#000'}
                    placeholder={'Ask a question...'}
                />
            </View>
            {
                show ? <View style={styles.pollChoicesContainer}>
                    <PollChoices
                        setShow={setShow} />
                </View>
                    :
                    <View style={{ marginTop: 15 }}>
                        <Button
                            title={'Choices'}
                            onPress={() => setShow(show => !show)} />
                    </View>
            }
        </KeyboardAwareScrollView>
    )
};
export default observer(Create);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 8
    },
    tweetContainer: {
        flexDirection: 'row',
    },
    imageContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#ebecf0'
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    textInput: {
        marginLeft: 5,
        fontSize: 15,
        width: '80%',
        paddingTop: 10,
        borderRadius: 8
    },
    pollChoicesContainer: {
        marginLeft: 45,
        marginTop: 10
    },
})