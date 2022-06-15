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
        fontFamily: "Gibson",
        fontWeight: 600,        
        [theme.breakpoints.down('md')]: {
            paddingTop: '6px',
            paddingBottom: '6px',
            fontSize: "14px"
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: '7px',
            paddingBottom: '7px',
            fontSize: "16px"
        }
    },
}))

export const PrimaryButtonMD = ({ width = 'fit-content', children, onClick, disabled = false, isLoading = false }: ButtonProps) => {
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
            <span className={`text-[14px] md:text-[16px] ${isLoading?'font-medium':'font-medium'} uppercase`}>{children}</span>
        </Button>
    )
}
