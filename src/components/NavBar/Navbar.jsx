import { useContext } from 'react'
import { Link } from 'react-router'
import { UserContext } from '../../contexts/UserContext'
const NavBar = () => {
    const { user } = useContext(UserContext)
    const handleSignOut = () => {
        localStorage.removeItem('token')
        setUser(null)
    }
    return (
        <nav>
            {user ? (
                <ul>
                    <li>
                        <Link to='/'>HOME</Link>
                    </li>
                    <li>
                        <Link to='/hoots'>HOOTS</Link>
                    </li>
                    <li>
                        <Link to='/hoots/new'>NEW HOOT</Link>
                    </li>
                    <li>
                        <Link to='/' onClick={handleSignOut}>
                            SIGN OUT
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/sign-up'>Sign Up</Link>
                    </li>
                    <li>
                        <Link to='/sign-in'>Sign In</Link>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default NavBar
