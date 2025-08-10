import Heading from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";

export function Login(){
    return <div>
        <Heading label={"Log In"} />
        <SubHeading label={"Enter Your Credential"} />
        <InputBox label={"Email or Username"} placeholder={"Enter your Eamil or Username"}/>
        <InputBox label={"Password"} placeholder={"Enter Your Password"}/>
        <Button label={"Login"}/>
        <BottomWarning label={"Dont have an Account ? "} buttontext={"Create One"} to={"./Signup"}/>
    </div>
}