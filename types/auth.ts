export type Role = 'admin' | 'editor' | 'writer' | 'member' | null

export type Profile = {
  name: string | null
  username: string | null
  email: string | null
  avatarUrl: string | null
}

export type Viewer = {
  isLoggedIn: boolean
  role: Role
  canAccessDashboard: boolean
  profile: Profile
}
