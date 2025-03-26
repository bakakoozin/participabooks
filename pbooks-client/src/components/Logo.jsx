import { useState } from "react";

export function Logo() {
    const [isHover, setIsHover] = useState(false);

    return (
        <div 
            className={`logo ${isHover ? "hover" : ""}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className={`logo-icon ${isHover ? "hover" : ""}`}>
                <div className="logo-text">p</div>
            </div>
            <div className={`logo-name ${isHover ? "hover" : ""}`}>books</div>
        </div>
    );
}