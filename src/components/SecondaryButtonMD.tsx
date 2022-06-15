

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
        margin: '4px',
        borderRadius: "9999px",        
        color: "#FFFFFF",       
        fontFamily: "Gibson",
        fontWeight: 600,        
        [theme.breakpoints.down('md')]: {
            paddingTop: '4px',
            paddingBottom: '4px',
            fontSize: "14px"
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: '5px',
            paddingBottom: '5px',
            fontSize: "16px"
        }
    },
}))

export const SecondaryButtonMD = ({ width = 'fit-content', children, onClick, disabled = false, isLoading = false }: ButtonProps) => {
    const classes = useStyles()

    return (
        <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            style={{ width: width, border: disabled?'2px solid #C8C8C8':'2px solid #050025', color: disabled?isLoading?'#7dd3fc':'#A8A8A8':'#051C42', backgroundColor:isLoading?'#f9fafb':'' }}
            onClick={onClick}
            disabled={disabled}
            disableElevation
        >
            {/* {children} */}
            <span className={`text-[14px] md:text-[16px] font-medium uppercase`}>{children}</span>
        </Button>
    )
}
