import { ArrowLeft, LogOut, User, Target, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

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
      <div className="sticky top-0 bg-glass border-b border-glass backdrop-blur-glass p-4 flex items-center space-x-3">
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
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-text-muted">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Goals Section */}
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Goals & Targets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Set Calorie Goal
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Set Macro Targets
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Custom Nutrient Tracking
            </Button>
          </CardContent>
        </Card>

        {/* Meals Section */}
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Utensils className="w-5 h-5" />
              <span>Meals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-start">
              Manage Meals & Time Slots
            </Button>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Theme Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notifications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Data Export
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Sign Out */}
        <Button 
          variant="destructive" 
          className="w-full"
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