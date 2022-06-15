import Draggable from "react-draggable"
import Paper from "@material-ui/core/Paper"

export default function PaperComponent(props: any) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    )
}