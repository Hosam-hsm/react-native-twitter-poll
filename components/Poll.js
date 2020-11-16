import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { observer } from "mobx-react";
import { BLUE } from "../../constants";
import { useStore } from "../store";
import PollResults from "./PollResults";

const PollChoices = observer((props) => {
    const store = useStore()
    const handleVote = choice => {
        const { post } = props;
        const { id } = post;
        store.vote(id, choice);
    }
    const { post } = props;
    const { choices } = post;

    return <>
        {choices.map((choice, index) => {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    style={{
                        borderColor: BLUE,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 5,
                        marginVertical: 5,
                        alignItems: 'center'
                    }}
                    onPress={() => handleVote(index)}>
                    <Text style={{ fontWeight: 'bold' }}>{choice.choice}</Text>
                </TouchableOpacity>
            );
        })}
    </>
})

const Poll = ({ post, voted, votedChoice, votes, expires }) => {
    const store = useStore()
    const isExpired = expires.isBefore();
    return (
        <View style={styles.container}>
            {(isExpired || post.creator.id == store.user.id || voted) ? //post creator and already voted user cannot vote again. 
                <PollResults votes={votes} votedChoice={votedChoice} /> //can change the condition if the results should be shown only after expiration of the post.
                :
                <PollChoices post={post} />
            }
        </View>
    )
};
export default observer(Poll);

const styles = StyleSheet.create({
    container: {

    }
})