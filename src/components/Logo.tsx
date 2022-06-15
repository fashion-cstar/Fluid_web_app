export const Logo = () => {

    return (
        <div>
            <div className='hidden md:block'>
                <img src="/images/logo_full.svg" alt="FLUID" />
            </div>
            <div className='md:hidden'>
                <img src="/images/logo_full_medium.svg" alt="FLUID" />
            </div>
        </div>
    )
}
