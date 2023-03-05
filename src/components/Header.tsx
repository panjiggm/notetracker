import { signIn, signOut, useSession } from "next-auth/react"

export const Header: React.FC = () => {
  const {data: sessionData} = useSession()

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-xl font-bold">
        {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ''}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          {sessionData?.user ? (
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar" onClick={() => signOut()}>
              <div className="w-8 h-8 rounded-full">
                <img src={sessionData?.user?.image ?? ""} alt={sessionData?.user?.name ?? ""} />
              </div>
            </label>
          ) : (
            <button className="btn btn-ghost rounded-btn" onClick={() => signIn()}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  )
}