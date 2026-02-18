import { useContext } from 'react'
import { Link } from 'react-router'
import { UserContext } from '../../contexts/UserContext'
const NavBar = () => {
    const { user, setUser } = useContext(UserContext)
    const handleSignOut = () => {
        localStorage.removeItem('token')
        setUser(null)
    }
    return (
        <nav className="border-b border-border-subtle">
            {user ? (
                <ul className="flex gap-6 max-w-6xl mx-auto px-4 py-3">
                    <li>
                        <Link to='/' className="text-primary hover:text-primary-dark font-medium">HOME</Link>
                    </li>
                    <li>
                        <Link to='/challenges' className="text-primary hover:text-primary-dark font-medium">CHALLENGES</Link>
                    </li>
                    <li>
                        <Link to='/challenges/new' className="text-primary hover:text-primary-dark font-medium">NEW CHALLENGE</Link>
                    </li>
                    <li>
                      <Link to="/progress"  className="text-primary hover:text-primary-dark font-medium">PROGRESS</Link>
                    </li>
                    <li>
                        <Link to='/' onClick={handleSignOut} className="text-primary hover:text-primary-dark font-medium">
                            SIGN OUT
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul className="flex gap-6 max-w-6xl mx-auto px-4 py-3">
                    <li>
                        <Link to='/' className="text-primary hover:text-primary-dark font-medium">Home</Link>
                    </li>
                    <li>
                        <Link to='/sign-up' className="text-primary hover:text-primary-dark font-medium">Sign Up</Link>
                    </li>
                    <li>
                        <Link to='/sign-in' className="text-primary hover:text-primary-dark font-medium">Sign In</Link>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default NavBar
