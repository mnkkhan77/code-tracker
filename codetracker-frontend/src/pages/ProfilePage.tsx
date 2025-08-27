// src/pages/ProfilePage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useProfilePage, UserProfile } from "@/hooks/useProfilePage";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfilePage();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserProfile, string>>
  >({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
      });
      setErrors({});
    }
  }, [profile]);

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        Could not load profile. Please try again later.
      </div>
    );
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Full Name is required.";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof UserProfile]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before saving.");
      return;
    }
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to update profile.");
    }
  };

  const getInitials = (name?: string): string => {
    if (!name) return "NO NAME";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          My Profile
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          View and edit your personal information.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-foreground">
                    Profile Picture
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This will be displayed on your profile.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                      <AvatarFallback>
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline">
                      Change
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-foreground">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Update your full name and email address.
                  </p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-foreground">
                    Bio
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Write a short introduction about yourself.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </div>
              </div>

              {!isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-foreground">
                      Statistics
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your coding progress and achievements.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary">
                          {profile.problemsSolved || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Problems Solved
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary">
                          {profile.currentStreak || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current Streak
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary">
                          {profile.totalSubmissions || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Submissions
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary">
                          {profile.rank || "Unranked"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Global Rank
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
