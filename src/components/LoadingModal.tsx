import CircularProgress from '@material-ui/core/CircularProgress'
interface PopupProps {
    isOpen?: boolean
}

export default function LoadingModal({
    isOpen
}: PopupProps) {

    return (
        <div
            aria-hidden="true"
            role="dialog"
            style={{ backgroundColor: '#00000020', display: isOpen ? "flex" : "none" }}
            className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 z-50 justify-center items-center h-modal h-full inset-0"
        >
            <div className='w-full flex justify-center items-center' style={{maxHeight:'calc(100vh - 125px)'}}>
                <CircularProgress />
            </div>
        </div>
    )
}