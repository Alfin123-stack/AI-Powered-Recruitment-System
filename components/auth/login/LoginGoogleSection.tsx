import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";

export function LoginGoogleSection() {
  return (
    <>
      <GoogleButton label="Lanjutkan dengan Google" />
      <div className="my-5">
        <Divider label="atau masuk dengan email" />
      </div>
    </>
  );
}
