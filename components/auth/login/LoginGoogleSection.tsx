import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";

export function LoginGoogleSection() {
  return (
    <>
      <GoogleButton label="Continue with Google" />
      <div className="my-5">
        <Divider label="or sign in with email" />
      </div>
    </>
  );
}
