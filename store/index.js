import React from "react";
import { makeAutoObservable } from "mobx";

export default class Store {
    user = {
        "id": "5445",
        "name": "Hosam Ashraf",
        "image": "https://picsum.photos/30/30"
    }

    posts = [
        {
            "id": "1",
            "creator": {
                "id": "4646464",
                "image": "https://picsum.photos/30/30",
                "name": "ABCD"
            },
            "createdAt": "2020-11-14T05:18:21.018Z",
            "question": "I've already voted for this post",
            "votes": [
                {
                    "user": "5445", //userId
                    "choice": "0"
                },
                {
                    "user": "4654",
                    "choice": "2"
                },
                {
                    "user": "4654",
                    "choice": "2"
                },
                {
                    "user": "8548",
                    "choice": "2"
                },
            ],
            "duration": "864000",
            "choices": [
                {
                    "id": "0",
                    "choice": "abc"
                },
                {
                    "id": "1",
                    "choice": "def"
                },
                {
                    "id": "2",
                    "choice": "dfgfds"
                },
            ]
        },
        {
            "id": "2",
            "creator": {
                "id": "5445", //current user created this post. So he cannot vote.
                "image": "https://picsum.photos/30/30",
                "name": "Hosam Ashraf"
            },
            "createdAt": "2020-11-14T05:18:21.018Z",
            "question": "This post was created by me. So I cannot vote.",
            "votes": [
                {
                    "user": "534665", //userId
                    "choice": "0"
                },
                {
                    "user": "4654",
                    "choice": "1"
                },
                {
                    "user": "46",
                    "choice": "2"
                },
                {
                    "user": "6",
                    "choice": "2"
                },
                {
                    "user": "644",
                    "choice": "0"
                },
            ],
            "duration": "198000000",
            "choices": [
                {
                    "id": "0",
                    "choice": "abc"
                },
                {
                    "id": "1",
                    "choice": "def"
                },
                {
                    "id": "2",
                    "choice": "ghi"
                },
            ]
        },
        {
            "id": "3",
            "creator": {
                "id": "4646464",
                "image": "https://picsum.photos/30/30",
                "name": "XYZ"
            },
            "createdAt": "2020-11-14T05:18:21.018Z",
            "question": "Click a choice to vote.",
            "votes": [
                {
                    "user": "544554", //userId
                    "choice": "0"
                },
                {
                    "user": "4654",
                    "choice": "1"
                },
                {
                    "user": "46",
                    "choice": "1"
                },
            ],
            "duration": "86400000",
            "choices": [
                {
                    "id": "0",
                    "choice": "Choice 1"
                },
                {
                    "id": "1",
                    "choice": "Choice 2"
                },
            ]
        },
        {
            "id": "4",
            "creator": {
                "id": "4646464",
                "image": "https://picsum.photos/30/30",
                "name": "RSTUV"
            },
            "createdAt": "2020-11-14T05:18:21.018Z",
            "question": "Click a choice to vote.",
            "votes": [
                {
                    "user": "45", //userId
                    "choice": "0"
                },
                {
                    "user": "44",
                    "choice": "1"
                },
                {
                    "user": "325",
                    "choice": "2"
                },
                {
                    "user": "35",
                    "choice": "2"
                },
            ],
            "duration": "86400000",
            "choices": [
                {
                    "id": "0",
                    "choice": "Choice 1"
                },
                {
                    "id": "1",
                    "choice": "Choice 2"
                },
                {
                    "id": "2",
                    "choice": "Choice 3"
                },
            ]
        },
    ]

    pollLength = {
        "Days": 1,
        "Hours": 0,
        "Minutes": 0
    };
    question = undefined;
    choices = undefined;

    constructor() {
        makeAutoObservable(this)
    }

    setQuestion(question) {
        this.question = question;
    }

    setChoices(choices) {
        let temp = choices.map((choice, i) => {
            let data = {
                "id": `${i}`,
                "choice": choice
            }
            return data;
        }) //adding id for each choice
        this.choices = temp;
    }

    setPollLength(length) {
        this.pollLength = length
    }

    getData() {
        let days = this.pollLength.Days * 86400000;
        let hours = this.pollLength.Hours * (60000 * 60);
        let minutes = this.pollLength.Minutes * 60000
        let milliLength = days + hours + minutes;
        let data = {
            "question": this.question,
            "choices": this.choices,
            "duration": milliLength,
        }
        return data
    }

    createPoll() {
        let content = this.getData()
        let data = {
            "creator": this.user,
            ...content
        }
        //pass data to createPoll API
    }

    get getPollLength() {
        let d = this.pollLength.Days
        let h = this.pollLength.Hours
        let m = this.pollLength.Minutes
        let days = d != 0 ? `${d} ${d > 1 ? 'days' : 'day'}` : '';
        let hours = h != 0 ? `${h} ${h > 1 ? 'hours' : 'hour'}` : '';
        let minutes = m != 0 ? `${m} ${m > 1 ? 'minutes' : 'minute'}` : '';
        let len = days + ' ' + hours + ' ' + minutes;
        return len;
    }

    vote(postId, choice) {
        //should pass postId and choice along with the userId to vote API.
        const i = this.posts.findIndex(post => post.id == postId)
        this.posts[i].votes.push({
            "user": this.user.id,
            "choice": choice
        }) //for demo of voting.
    }
}

const StoreContext = React.createContext();

export const StoreProvider = ({ children, store }) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

/* Hook to use store in any functional component */
export const useStore = () => React.useContext(StoreContext);

/* HOC to inject store to any functional or class component */
export const withStore = (Component) => (props) => {
    return <Component {...props} store={useStore()} />;
};