
import { useLogout } from "../../features/hooks/UserHooks/useLogout";
import toast from "react-hot-toast";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import {
  LuUserRound,
  LuBookmark,
  LuCalendarCheck2,
  LuHeadset,
  LuStar,
  LuArrowLeft,
  LuMap,
} from "react-icons/lu";

import {
  Layout,
  SideBar,
  MainBar,
  HeaderSiderBar,
  MainMenuSideBar,
  FooterSideBar,
  UserPill,
  ImageWrapper,
  Image,
  UserName,
  Menu,
  MenuItem,
  MenuIcon,
  FooterLinks,
  FooterButton,
  Logout,
} from "./UserPage.Styles";

const menuItems = [
  {
    title: "Manage Account",
    path: "manage-account",
    icon: LuUserRound,
  },
  {
    title: "Bookmarked Tours",
    path: "bookmarked-tours",
    icon: LuBookmark,
  },
  {
    title: "Booked Tours",
    path: "my-bookings",
    icon: LuCalendarCheck2,
  },
  {
    title: "Assistance",
    path: "assistance",
    icon: LuHeadset,
  },
  {
    title: "Reviewed Tours",
    path: "reviews",
    icon: LuStar,
  },
];

function UserPage({ user })
{

  const navigate = useNavigate();
 const { logout } = useLogout({
   onSuccess: () => {
     toast.success("Logged out successfully");
     navigate('/');
     
   },
   onError: () => {
     toast.error("Logout failed");
   },
 });

 function handleLogout() {
   logout();
  }
  
  return (
    <Layout>
      <SideBar>
        <HeaderSiderBar>
          <UserPill>
            <ImageWrapper>
              <Image
                src={
                  user.photo !== "default-user.jpg" ? user.photo.url : "/user.svg"
                }
                alt="User"
              />
            </ImageWrapper>

            <UserName>{user.name}</UserName>
          </UserPill>
        </HeaderSiderBar>

        <MainMenuSideBar>
          <Menu>
            
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <MenuItem key={item.path} as={NavLink} to={item.path} end>
                    <MenuIcon>
                      <Icon />
                    </MenuIcon>

                    {item.title}
                  </MenuItem>
                );
              })}
            
            <Logout onClick={handleLogout}>Logout</Logout>
          </Menu>
        </MainMenuSideBar>

        <FooterSideBar>
          <FooterLinks>
            <FooterButton as={Link} to="/">
              <LuArrowLeft />
              Back
            </FooterButton>

            <FooterButton as={Link} to="/tours" primary>
              <LuMap />
              Explore Tours
            </FooterButton>
          </FooterLinks>
        </FooterSideBar>
      </SideBar>

      <MainBar>
        <Outlet />
      </MainBar>
    </Layout>
  );
}

export default UserPage;
