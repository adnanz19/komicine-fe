import { GalleryVerticalEnd, X } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/watch.jpg"
          alt="Image"
          fill 
          priority 
          sizes="50vw" 
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <Image src="/KomiCine.svg" alt="" width={100} height={100} />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="absolute right-6 top-6">
        <X className="size-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
