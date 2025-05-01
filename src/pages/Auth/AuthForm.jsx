import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useToast } from "../../components/ui/use-toast";
import RegisterForm from "./RegisterFrom";
import LoginForm from "./LogInFrom";
import { useAuth } from "../../context/auth-context";

const AuthForm = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  const handleLoginSuccess = () => {
    toast({
      title: "Login successful!",
      description: "Welcome back to the platform.",
    });
  };

  const handleRegisterSuccess = async (data) => {
    toast({
      title: "Registration successful!",
      description: "Your account has been created. You can now log in.",
    });
    // Switch to login tab after successful registration
    setActiveTab("login");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
      <div className="w-full mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
        <p className="text-muted-foreground">
          Sign in or create an account to continue
        </p>
      </div>

      <Card className="w-full shadow-lg border-opacity-50">
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-4">
            <TabsContent value="login" className="space-y-4 animate-fade-in">
              <LoginForm onSuccess={handleLoginSuccess} />
            </TabsContent>
            <TabsContent value="register" className="space-y-4 animate-fade-in">
              <RegisterForm onSuccess={handleRegisterSuccess} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForm;
