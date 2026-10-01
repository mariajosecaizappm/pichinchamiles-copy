import HomeMenu from "./components/Menu";
import HeaderActions from "./components/HeaderActions/HeaderActions";
import Miles from "./components/Miles";
import Logo from "./components/Logo/Logo";
import HeaderWrapper from "./components/HeaderWrapper/HeaderWrapper";
import HeaderStickyWrapper from "./HeaderStickyWrapper";
import { Suspense } from "react";
import MenuTrigger from "./components/Menu/components/MenuTrigger";

const Header = () => {
    return (
        <HeaderStickyWrapper>
            <HeaderWrapper>
                <Suspense fallback={
                    <MenuTrigger isDisabled />
                }>
                    <HomeMenu/>
                </Suspense>
                <Logo/>
                <HeaderActions/>
            </HeaderWrapper>
            <Miles isMobile/>
        </HeaderStickyWrapper>
    );
};

export default Header;
