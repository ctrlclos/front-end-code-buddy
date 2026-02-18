import { useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import { signUp } from '../../services/authService'
import { UserContext } from '../../contexts/UserContext'

const SignUpForm = () => {
    const navigate = useNavigate()
    const { setUser } = useContext(UserContext)
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConf: '',
    })

    const { username, password, passwordConf } = formData

    const handleChange = (evt) => {
        setMessage('')
        setFormData({ ...formData, [evt.target.name]: evt.target.value })
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        try {
            const newUser = await signUp(formData)
            setUser(newUser)
            navigate('/')
        } catch (err) {
            setMessage(err.message)
        }
    }

    const isFormInvalid = () => {
        return !(username && password && password === passwordConf)
    }

    return (
        <main className="max-w-md mx-auto px-8 py-16">
            <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
            <p className="text-error mb-4">{message}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor='username' className="text-sm font-medium">Username:</label>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        name='username'
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm placeholder:text-muted focus:border-primary focus:outline-none"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor='password' className="text-sm font-medium">Password:</label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        name='password'
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm placeholder:text-muted focus:border-primary focus:outline-none"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor='confirm' className="text-sm font-medium">Confirm Password:</label>
                    <input
                        type='password'
                        id='confirm'
                        value={passwordConf}
                        name='passwordConf'
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm placeholder:text-muted focus:border-primary focus:outline-none"
                        required
                    />
                </div>
                <div className="flex gap-3 mt-2">
                    <button disabled={isFormInvalid()} className="w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">Sign Up</button>
                    <button onClick={() => navigate('/')} className="w-full py-2 rounded-lg border border-border-default text-muted font-semibold hover:border-primary hover:text-primary">Cancel</button>
                </div>
            </form>
        </main>
    )
}

export default SignUpForm
