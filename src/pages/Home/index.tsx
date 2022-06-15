/* eslint-disable react-hooks/exhaustive-deps */
import { NavBar } from './NavBar'

export const Home = () => {
 
  return (
    <div className="w-full h-screen bg-no-repeat bg-center" style={{backgroundImage: 'url(/images/back_hero.png)'}}>
        <NavBar />
    </div>
  )
}
