import { ArrowLeft, LogOut, User, Target, Utensils, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { EditProfileDialog } from '@/components/settings/EditProfileDialog';
import { GoalSettingsDialog } from '@/components/settings/GoalSettingsDialog';
import { MealsManagementDialog } from '@/components/settings/MealsManagementDialog';
import { CustomNutrientSettingsDialog } from '@/components/settings/CustomNutrientSettingsDialog';

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { profile, loading: profileLoading } = useProfile();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You've been signed out of your account."
      });
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky-header bg-gradient-glass border-b border-glass backdrop-blur-glass shadow-deep p-4 flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-bg-light rounded-lg border border-border">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-text">
                  {profile?.display_name || 'No name set'}
                </p>
                <p className="text-sm text-text-muted">{user?.email}</p>
              </div>
            </div>
            <EditProfileDialog>
              <Button variant="outline" className="w-full bg-glass border-border hover:bg-bg-light">
                Edit Profile
              </Button>
            </EditProfileDialog>
          </CardContent>
        </Card>

        {/* Goals Section */}
        <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Goals & Targets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Current Goals Display */}
            {profile && (
              <div className="p-3 bg-bg-light rounded-lg border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Daily Goal</span>
                  <span className="font-medium text-text">{profile.calorie_goal || 2000} calories</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Mode</span>
                  <span className="text-text capitalize">{profile.goal_type || 'grams'}</span>
                </div>
              </div>
            )}
            
            <GoalSettingsDialog>
              <Button variant="outline" className="w-full justify-start bg-glass border-border hover:bg-bg-light">
                <Target className="w-4 h-4 mr-2" />
                Set Nutrition Goals
              </Button>
            </GoalSettingsDialog>
            
            <CustomNutrientSettingsDialog>
              <Button variant="outline" className="w-full justify-start bg-glass border-border hover:bg-bg-light">
                <Target className="w-4 h-4 mr-2" />
                Custom Nutrient Tracking
              </Button>
            </CustomNutrientSettingsDialog>
          </CardContent>
        </Card>

        {/* Meals Section */}
        <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-primary" />
              <span>Meals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MealsManagementDialog>
              <Button variant="outline" className="w-full justify-start bg-glass border-border hover:bg-bg-light">
                <Utensils className="w-4 h-4 mr-2" />
                Manage Meals & Time Slots
              </Button>
            </MealsManagementDialog>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-bg-light rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="font-medium text-text">Theme</p>
                  <p className="text-sm text-text-muted">
                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'light'}
                onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
              />
            </div>
            <Button variant="outline" className="w-full justify-start bg-glass border-border hover:bg-bg-light" disabled>
              <span className="opacity-50">Notifications</span>
              <span className="ml-auto text-xs text-text-muted">Coming Soon</span>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-glass border-border hover:bg-bg-light" disabled>
              <span className="opacity-50">Data Export</span>
              <span className="ml-auto text-xs text-text-muted">Coming Soon</span>
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Sign Out */}
        <Button 
          variant="destructive" 
          className="w-full shadow-soft hover:shadow-layered transition-all duration-300"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;