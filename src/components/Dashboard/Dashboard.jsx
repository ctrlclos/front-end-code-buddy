import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import * as userService from '../../services/userService'

const Dashboard = () => {
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await userService.index()
                setUsers(fetchedUsers)
            } catch (err) {
                console.log(err)
            }
        }
        if (user) fetchUsers()
    }, [user])

    return (
        <main className="max-w-4xl mx-auto px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}</h1>
            <section className="bg-bg-card rounded-lg border border-border-subtle shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Users</h2>
                {users.length > 0 ? (
                    <ul className="flex flex-col">
                        {users.map((item) => (
                            <li key={item.id} className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0">
                                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center uppercase">
                                    {item.username.charAt(0)}
                                </span>
                                <span className="text-sm font-medium">{item.username}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted text-center py-4">No users found.</p>
                )}
            </section>
        </main>
    )
}
export default Dashboard
