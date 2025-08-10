import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export function Dashboard(){
    return <div>
        <AppBar />
        <div className="mt-8 relative left-3">
            <Balance value = {`10,000`}/>
            <Users />
        </div>
    </div>
}