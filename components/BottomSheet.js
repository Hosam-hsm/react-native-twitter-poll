import { observer } from "mobx-react";
import React, { forwardRef, useCallback } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import ScrollPicker from "./WheelPicker";

const BottomSheet = forwardRef(({ }, ref) => {
    const close = useCallback(() => {
        ref.current.close();
    }, [])

    return (
        <RBSheet
            ref={ref}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
                wrapper: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                draggableIcon: {
                    backgroundColor: "#000"
                },
                container: {
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    padding: 15
                }
            }}
        >
            <ScrollPicker closeBottomSheet={close} />
        </RBSheet>
    );
})

export default observer(BottomSheet)
