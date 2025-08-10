import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import Heading from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export function SignupForm(){
    return <div className="flex items-center justify-center h-screen bg-gray">
        <div className="bg-blue-200 p-6 rounded">
            <Heading label={"Sign Up"}></Heading>
            <SubHeading label = {"Enter you information to create an account"}></SubHeading>
            <InputBox label={"Eamil (Username)"} placeholder={"Enter Eamil (Username)"}></InputBox>
            <InputBox label={"First Name"} placeholder={"Ener First Yourname"}></InputBox>
            <InputBox label={"Last Name"} placeholder={"Ener last Yourname"}></InputBox>
            <InputBox label={"Password"} placeholder={"Ener Your Password"}></InputBox>
            <InputBox label={"Confirm Password"} placeholder={"Confirm Your Password"}></InputBox>
            <Button label = {"Click Me"}></Button>
            <BottomWarning label={"Already have an Account? "} buttontext={"Log in"} to={'/login'}></BottomWarning>
        </div>
    </div>
}