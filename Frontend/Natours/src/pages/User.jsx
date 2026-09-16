import UserPage from "../ui/User/UserPage"
import useUser from "../features/hooks/UserHooks/useUser";
function User()
{
    const { user } = useUser();
    return (
        <div>
            <UserPage user={user}/>
        </div>
    )
}

export default User
