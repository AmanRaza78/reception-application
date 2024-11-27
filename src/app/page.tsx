import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 justify-center items-center h-screen bg-gray-300">
      <h1 className="text-4xl tracking-tighter font-semibold">
        Welcome To <span className="text-primary">JoboxHire</span>
      </h1>
      <LoginLink>
        <Button size={"lg"}>Login</Button>
      </LoginLink>
    </div>
  );
} 
