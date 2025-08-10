import {Link} from "react-router-dom";

export function BottomWarning({label,buttontext,to}){
    return <div className="py-2 text-sm flex justify-center">
        <div>
            {label}
        </div>
        <Link rel="stylesheet" href={to} >
            {buttontext}
        </Link>
    </div>
}