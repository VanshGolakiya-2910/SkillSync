import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

import { getUserById } from '@/services/user.service';
import {
  getFollowers,
  getFollowing,
  followUser,
} from '@/services/social.service';

import { isOwner } from '@/utils/isOwner';

import ProfileHeader from '@/components/user/ProfileHeader';
import ProfileStats from '@/components/user/ProfileStats';
import ProfileActions from '@/components/user/ProfileActions';
import ProfileMeta from '@/components/user/ProfileMeta';
import ProfileProjects from '@/components/user/ProfileProjects';

export default function Profile() {
  const { id } = useParams();
  const { user: authUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = !id || id === authUser?._id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        /* ---------------- Load profile user ---------------- */
        const userData = isOwnProfile
          ? authUser
          : (await getUserById(id))?.data?.data;

        if (!userData) return;

        setProfileUser(userData);

        /* ---------------- Followers / Following ---------------- */
        const [followersRes, followingRes] = await Promise.all([
          getFollowers(userData._id),
          getFollowing(userData._id),
        ]);

        const followers = Array.isArray(
          followersRes?.data?.data?.followers
        )
          ? followersRes.data.data.followers
          : [];

        const following = Array.isArray(
          followingRes?.data?.data?.following
        )
          ? followingRes.data.data.following
          : [];

        setFollowersCount(followers.length);
        setFollowingCount(following.length);

        /* ---------------- Follow state ---------------- */
        if (!isOwnProfile && authUser?._id) {
          setIsFollowing(
            followers.some((u) => u._id === authUser._id)
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (authUser) loadProfile();
  }, [id, authUser, isOwnProfile]);

  if (loading || !profileUser) return null;

  const owner = isOwner(authUser, profileUser);

  const handleFollow = async () => {
    if (followLoading) return;

    setFollowLoading(true);
    try {
      await followUser(profileUser._id);
      setIsFollowing(true);
      setFollowersCount((c) => c + 1);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* ---------------- Profile Card ---------------- */}
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <ProfileHeader user={profileUser} />

        <ProfileStats
          followers={followersCount}
          following={followingCount}
        />

        <ProfileActions
          owner={owner}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          loading={followLoading}
        />
      </div>

      {/* ---------------- Projects Section ---------------- */}
      <ProfileProjects
        userId={profileUser._id}
        owner={owner}
      />

      {/* ---------------- Meta ---------------- */}
      <ProfileMeta user={profileUser} />
    </div>
  );
}
