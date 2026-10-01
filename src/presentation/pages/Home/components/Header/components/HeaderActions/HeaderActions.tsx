"use client";

import LoginButton from "../../../Button/LoginButton";
import CartButton from "../Cart/CartButton";
import Miles from "../Miles";

const HeaderActions = () => {
    return (
        <div className="justify-self-end">
            <div className="flex items-center gap-9">
                <div className="hidden lg:block">
                    <Miles />
                </div>
                <CartButton />
            </div>
            <LoginButton />
        </div>
    );
};

export default HeaderActions;
