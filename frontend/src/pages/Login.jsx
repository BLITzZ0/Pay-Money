import Heading from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";

export function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <Heading label="Log In" />
        <SubHeading label="Enter your credentials to continue" />

        <div className="space-y-4 mt-4">
          <InputBox label="Email or Username" placeholder="Enter your Email or Username" />
          <InputBox label="Password" placeholder="Enter your Password" />
        </div>

        <div className="mt-6">
          <Button label="Login" />
        </div>

        <div className="mt-4 text-center">
          <BottomWarning
            label="Don't have an Account?"
            buttontext="Create One"
            to="/"
          />
        </div>
      </div>
    </div>
  );
}
