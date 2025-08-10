import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import Heading from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export function SignupForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <Heading label="Sign Up" />
        <SubHeading label="Enter your information to create an account" />

        <div className="space-y-4 mt-4">
          <InputBox label="Email (Username)" placeholder="Enter Email (Username)" />
          <InputBox label="First Name" placeholder="Enter your First Name" />
          <InputBox label="Last Name" placeholder="Enter your Last Name" />
          <InputBox label="Password" placeholder="Enter your Password" />
          <InputBox label="Confirm Password" placeholder="Confirm your Password" />
        </div>

        <div className="mt-6">
          <Button label="Create Account" />
        </div>

        <div className="mt-4 text-center">
          <BottomWarning
            label="Already have an Account?"
            buttontext="Log in"
            to="/login"
          />
        </div>
      </div>
    </div>
  );
}
