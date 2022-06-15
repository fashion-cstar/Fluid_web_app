import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

interface ButtonProps {
    width?: string | undefined,
    children?: React.ReactNode,
    onClick: (e: any) => void,
    disabled?: boolean | undefined,
    isLoading?: boolean | undefined
}

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: "9999px",
        margin: '4px',
        color: "#FFFFFF",       
        fontFamily: "Gibson",
        fontWeight: 600,        
        [theme.breakpoints.down('md')]: {
            paddingTop: '9px',
            paddingBottom: '9px',
            fontSize: "16px"
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: '13px',
            paddingBottom: '13px',
            fontSize: "18px"
        }
    },
}))

export const PrimaryButton = ({ width = 'fit-content', children, onClick, disabled = false, isLoading = false }: ButtonProps) => {
    const classes = useStyles()

    return (
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            style={{ width: width, color: disabled?isLoading?'#f97316':'#A8A8A8':'#FFFFFF', backgroundColor:isLoading?'#e0f2fe':'' }}
            onClick={onClick}
            disabled={disabled}
            disableElevation
        >
            {/* {children} */}
            <span className={`text-[16px] md:text-[18px] font-semibold uppercase`}>{children}</span>
        </Button>
    )
}
