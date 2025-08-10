export function InputBox({label,placeholder}){
    return <div>
        <div className="text-sm font-medium text-left py-2">
            {label}
        </div>
        <input type="text" placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>
}