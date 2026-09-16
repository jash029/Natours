import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import styled from "styled-components";

import NavBar from "../ui/Navbar/NavBar";


const Layout = styled.main`

${({isUserRoute})=>
{
  if (isUserRoute) {
     return `
      padding-top: 70px;
      max-height: 90vh;
   `;
  }
  else {
     return `
     
     position : relative;
     top: 0;
   
      max-height: 90vh;
     
   `;
  }
  
 }   
}


`;

function AppLayout()
{


  const { pathName } = useLocation();

  const isUserRoute = pathName?.startsWith('/user');

  console.log(isUserRoute);
    return (
      <div>
        <ScrollRestoration />
        <NavBar />
        <Layout type={isUserRoute}>
          <Outlet />
        </Layout>
      </div>
    );
}

export default AppLayout;
