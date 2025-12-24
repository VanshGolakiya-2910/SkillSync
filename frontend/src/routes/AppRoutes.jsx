import { Routes, Route, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import PrivateRoute from './PrivateRoute'
import Layout from '@/components/layout/Layout'

// Auth pages (eager – small, critical)
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'

// User pages (lazy)
const Profile = lazy(() => import('@/pages/user/Profile'))
const EditProfile = lazy(() => import('@/pages/user/EditProfile'))
const ChangePassword = lazy(() => import('@/pages/user/ChangePassword'))

// Project pages (lazy)
const ProjectList = lazy(() => import('@/pages/project/ProjectList'))
const ProjectDetails = lazy(() => import('@/pages/project/ProjectDetails'))
const CreateProject = lazy(() => import('@/pages/project/CreateProject'))
const DiscoverProjects = lazy(() => import('@/pages/project/DiscoverProjects'))
const EditProject = lazy(() => import('@/pages/project/EditProject'))

// Social pages (lazy)
const Followers = lazy(() => import('@/pages/social/Followers'))
const Following = lazy(() => import('@/pages/social/Following'))
const FollowRequests = lazy(() => import('@/pages/social/FollowRequests'))

// Search (lazy)
const Search = lazy(() => import('@/pages/search/Search'))

// Misc
import NotFound from '@/pages/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <Layout>
              <Suspense fallback={null}>
                <Outlet />
              </Suspense>
            </Layout>
          }
        >
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/discover" element={<DiscoverProjects />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/password" element={<ChangePassword />} />

          <Route path="/followers" element={<Followers />} />
          <Route path="/following" element={<Following />} />
          <Route path="/follow-requests" element={<FollowRequests />} />

          <Route path="/search" element={<Search />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
