"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/icons';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const handleGuestLogin = () => {
    // In a real app, you'd handle guest sessions. For now, we'll just redirect.
    router.push('/');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Card className="w-full max-w-md shadow-2xl border-primary/10 animate-slide-in-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <Image src="/icon.png" alt="Pai Logo" width={64} height={64} />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome to Pai</CardTitle>
          <CardDescription>Your Personal AI Financial Assistant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full h-12 text-base" onClick={handleGuestLogin}>
            Continue as Guest
          </Button>
          <Button variant="outline" className="w-full h-12 text-base">
            <GoogleIcon className="mr-2 h-6 w-6" />
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with email
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Button className="w-full h-12 text-base bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            Sign Up / Login
          </Button>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
