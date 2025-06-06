import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@/services/types";
import { useEffect, useState } from "react";
import { InfiniteCarousel } from "./carousel";
import { UserCard } from "./browser-v2/userCard";

interface UserViewEditProps {
  user: User;
  isEditable: boolean;
  isLoading: boolean;
  onSave?: (user: User) => void;
  friendsData: {
    friends: User[];
    hasMore: boolean,
    fetchMore: () => void,
    error: any
  }
}

export const UserViewEdit: React.FC<UserViewEditProps> = ({ user, isEditable, isLoading, friendsData, onSave }) => {
  const [formState, setFormState] = useState<User>(user);
  const { friends, hasMore, fetchMore, error } = friendsData;

  useEffect(() => {
    setFormState(user)
  }, [user]);

  const handleChange =
    (field: keyof User) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState((s) => s && { ...s, [field]: e.target.value });
      };

  const handleSave = async () => {
    if (!onSave) return;
    onSave(formState);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Optional header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold text-center">Profile</h1>
      </header>

      {/* Main full-page form */}
      <main className="flex-1 overflow-auto p-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              {isEditable ? "Your Profile" : `${user?.fullName}'s Profile`}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 h-full flex flex-col">
            {/* Avatar & Name */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={isEditable ? formState?.photoUrl : user?.photoUrl}
                  alt={user?.fullName}
                />
                <AvatarFallback>
                  {user?.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {isEditable ? (
                <Input
                  value={formState?.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Full Name"
                  className="flex-1"
                />
              ) : (
                <h2 className="text-2xl font-medium">{user?.fullName}</h2>
              )}
            </div>

            {/* Description */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              {isEditable ? (
                <Textarea
                  value={formState?.description}
                  onChange={handleChange("description")}
                  placeholder="Tell us about yourself"
                  className="flex-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground flex-1 overflow-auto">
                  {user?.description}
                </p>
              )}
            </div>

            {/* Save button */}
            {isEditable && (
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <div className="text-lg font-semibold mb-4">
            {isEditable ? "My Friends" : "Common Friends"}
          </div>
          {error ? (
            <div> There has been an error loading friends </div>
          ) : (
            <InfiniteCarousel
              items={friends}
              hasMore={!!hasMore}
              loadMore={() => fetchMore()}
              itemWidthPx={180}
              className="px-2"
              renderItem={(friend) => (
                <UserCard key={friend.id} user={friend} actionHandler={() => console.log()} actions={[]} />
              )}
            />
          )}

        </div>
      </main>
    </div>
  )
}