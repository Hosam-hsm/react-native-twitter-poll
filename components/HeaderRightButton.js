import React, { useEffect, useState } from "react";
import {
    Text,
    TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import { BLUE } from "../../constants";
import { useStore } from "../store";

const Button = ({ }) => {
    const [disabled, setDisabled] = useState(true)
    const store = useStore()
    const navigation = useNavigation()

    const onPress = () => {
        store.createPoll()
        navigation.navigate('TwitterPollHome')
    }

    useEffect(() => {
        if (store.question && store.choices?.length >= 2) {
            setDisabled(false)
        }
        else setDisabled(true)
    }, [store.question, store.choices])

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={{ paddingHorizontal: 15 }}
        >
            <Text style={{ color: disabled ? 'grey' : BLUE, fontWeight: 'bold' }}>Create</Text>
        </TouchableOpacity>
    )
};
export default observer(Button);

