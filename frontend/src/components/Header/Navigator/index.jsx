import {
  Avatar,
  Box,
  HStack,
  IconButton,
  useColorMode,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  cookieStorageManager,
  Text,
  Button,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import React from "react";
import LinkButton from "@/components/LinkButton";
import { Colors } from "@/assets/constant/Colors";
import { useSelector } from "react-redux";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import api from "@/API/api";
import DrawerMenu from "@/components/DrawerMenu";
import { toast } from "react-toastify";
function Navigator({ getTranslate, isMobile }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const handleClick = () => (isOpen ? onClose() : onOpen());
  const userData = useSelector((state) => state.userReducer.data);
  const { data: session } = useSession();
  const routes = useRouter();
  const LogoutHandle = async () => {
    await api.signOut().then(async (res) => {
      localStorage.clear();
      sessionStorage.clear();
      const allCookies = Cookies.get();
      for (let cookie in allCookies) {
        Cookies.remove(cookie);
      }
      await signOut({ redirect: false })
        .then((res) => {
          signIn();
          localStorage.clear();
          sessionStorage.clear();

          toast.success("Logout success");
        })
        .catch((err) => {
          console.log("logout failed:", err);
        });
    }),
      (err) => {
        console.log("logout failed:", err);
      };
  };
  React.useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile]);
  const DashboardHandle = () => {
    routes.push("/user/profile?tab=activity");
  };
  return isMobile ? (
    <>
      <Box
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        justifyContent="center"
        aspectRatio={1}
        height={"50px"}
        position={{ base: "fixed", md: "relative" }}
        top={{ base: "0", md: "auto" }}
        right={{ base: "0", md: "auto" }}
      >
        <DrawerMenu
          onCloseButtonClick={handleClick}
          isOpen={isOpen}
          onClose={onClose}
        >
          <LinkButton
            href="/about"
            text={getTranslate("ABOUT")}
            onClick={handleClick}
          />
          {session?.user ? (
            <LinkButton
              href="/auth/logout"
              text={getTranslate("LOGOUT")}
              onClick={LogoutHandle}
            />
          ) : (
            <>
              {/* check if current routes is login */}
              {routes.pathname === "/auth/signin" ? null : (
                <LinkButton
                  style={{ paddingX: 0 }}
                  href="/auth/signin"
                  onClick={signIn}
                  text={getTranslate("LOGIN")}
                />
              )}
              <LinkButton
                style={{ paddingX: 0 }}
                textStyle={{ color: Colors(colorMode).PRIMARY }}
                href="/auth/signup"
                text={getTranslate("SIGNUP")}
              />
            </>
          )}
        </DrawerMenu>
      </Box>
    </>
  ) : session?.user ? (
    <Menu>
      <Button w={"100px"} as={MenuButton} variant="ghost">
        <HStack>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              color: Colors(colorMode).PRIMARY,
            }}
          >
            {session.user?.activityPoint ?? 0}
          </Text>
          <Avatar
            size={"xs"}
            name={session.user.fullname ? session.user.fullname : "Unknown"}
            src={session.user.avatar}
          />
        </HStack>
      </Button>
      <MenuList>
        <MenuItem onClick={DashboardHandle}>
          {getTranslate("DASHBOARD")}
        </MenuItem>
        <MenuItem onClick={LogoutHandle}>{getTranslate("LOGOUT")}</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <HStack spacing={0}>
      <LinkButton
        href="/about"
        style={{
          paddingX: 0,
        }}
        text={getTranslate("ABOUT")}
      />
      {routes.pathname === "/auth/signin" ? null : (
        <LinkButton
          style={{ paddingX: 0 }}
          href="/auth/signin"
          onClick={signIn}
          text={getTranslate("LOGIN")}
        />
      )}
      <LinkButton
        style={{
          paddingX: 0,
        }}
        textStyle={{ color: Colors(colorMode).PRIMARY }}
        href="/auth/signup"
        text={getTranslate("SIGNUP")}
      />
    </HStack>
  );
}

export default Navigator;
