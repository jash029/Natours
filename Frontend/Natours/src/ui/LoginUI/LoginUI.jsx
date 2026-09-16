import {
  Layout,
  FormWrapper,
  ImageWrapper,
  Background,
  HeroContent,
  HeroTitle,
  HeroButton
 
 
} from "./LoginUI.style";

import { Outlet} from "react-router-dom";

function LoginUI() {
  return (
    <Layout>
      <ImageWrapper>
        <Background
          src="/sky.jpg"
          alt="Mountain"
          initial={{
            scale: 1.45,
            opacity: 0,
            y: 120,
            filter: "blur(20px) brightness(0.4)",
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            filter: "blur(0px) brightness(1)",
          }}
          transition={{
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        <HeroContent>
          <HeroTitle
            initial={{
              opacity: 0,
              y: 70,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              delay: 0.8,
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            EXPERIENCE
            <br />
            BEYOND BOUNDARIES
          </HeroTitle>

          <HeroButton
            initial={{
              opacity: 0,
              y: 60,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 1.4,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            to="/tours"
          >
            Experience Now
          </HeroButton>
        </HeroContent>
      </ImageWrapper>

      <FormWrapper>
        <Outlet />
      </FormWrapper>
    </Layout>
  );
}

export default LoginUI;
