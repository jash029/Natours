import { useState } from "react";

import {
  Page,
  Header,
  Title,
  Subtitle,
  Tabs,
  Tab,
  Content,
} from "./ManageAccount.styles";
import PersonalInformation from "./PersonalInformation/PersonalInformation";
import ChangePassword from "./PersonalInformation/ChangePassword";
import DeleteAccount from "./PersonalInformation/DeleteAccount";

function ManageAccount() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <Page>
      <Header>
        <Title>Manage Account</Title>

        <Subtitle>
          Update your profile information, password and account settings.
        </Subtitle>
      </Header>

      <Tabs>
        <Tab
          active={activeTab === "personal"}
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </Tab>

        <Tab
          active={activeTab === "password"}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </Tab>

        <Tab
          danger
          active={activeTab === "delete"}
          onClick={() => setActiveTab("delete")}
        >
          Delete Account
        </Tab>
      </Tabs>

      <Content>
        {activeTab === "personal" && <PersonalInformation />}

        {activeTab === "password" && <ChangePassword />}

        {activeTab === "delete" && <DeleteAccount />}
      </Content>
    </Page>
  );
}

export default ManageAccount;
