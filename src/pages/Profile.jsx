import React from "react";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/4 mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Profile
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full shadow-md"
          />
          <p className="text-lg font-semibold">{user.name || "N/A"}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;