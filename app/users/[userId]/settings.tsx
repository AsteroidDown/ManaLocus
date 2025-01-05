import Button from "@/components/ui/button/button";
import CollapsableSection from "@/components/ui/collapsable-section/collapsable-section";
import Input from "@/components/ui/input/input";
import { EmailMask } from "@/constants/masks/text-masks";
import UserContext from "@/contexts/user/user.context";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, View } from "react-native";

interface PasswordErrors {
  lowercase?: boolean;
  uppercase?: boolean;
  number?: boolean;
  special?: boolean;
}

export default function UserSettingsPage() {
  const { user } = useContext(UserContext);

  const [preferencesOpen, setPreferencesOpen] = React.useState(false);
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [passwordErrors, setPasswordErrors] = React.useState(
    {} as PasswordErrors
  );

  if (!user) return null;

  useEffect(() => {
    setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (email.includes("@") && email.includes(".")) {
      if (email.match(EmailMask)) setEmailError(false);
      else setEmailError(true);
    } else setEmailError(false);
  }, [email]);

  useEffect(() => {
    if (newPassword.length < 8) {
      setPasswordErrors({});
      return;
    }

    let errors = {} as PasswordErrors;

    if (!newPassword.match(/[a-z]/)) errors = { ...errors, lowercase: true };
    if (!newPassword.match(/[A-Z]/)) errors = { ...errors, uppercase: true };
    if (!newPassword.match(/\d/)) errors = { ...errors, number: true };
    if (!newPassword.match(/[^a-zA-Z0-9]/))
      errors = { ...errors, special: true };

    setPasswordErrors(errors);
  }, [newPassword]);

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <CollapsableSection
        title="Preferences"
        expanded={preferencesOpen}
        setExpanded={setPreferencesOpen}
      ></CollapsableSection>

      <CollapsableSection
        title="Email"
        expanded={emailOpen}
        setExpanded={setEmailOpen}
      >
        <View className="flex flex-row -mb-9 justify-end">
          <Button
            text="Update"
            disabled={
              user.email === email ||
              !email.match(EmailMask) ||
              !email.includes("@") ||
              !email.includes(".") ||
              emailError
            }
            onClick={() => {}}
          />
        </View>

        <Input
          label="Update Your Email"
          placeholder="you@example.com"
          value={email}
          error={emailError}
          onChange={setEmail}
          errorMessage={
            email === user.email
              ? "Email can't be updated to your current email!"
              : emailError
              ? "Email must be valid"
              : ""
          }
        />
      </CollapsableSection>

      <CollapsableSection
        title="Password"
        expanded={passwordOpen}
        setExpanded={setPasswordOpen}
      >
        <View className="flex flex-row -mb-9 justify-end">
          <Button
            text="Update"
            disabled={
              Object.keys(passwordErrors).length > 0 ||
              newPassword.length < 8 ||
              newPassword !== confirmNewPassword
            }
            onClick={() => {}}
          />
        </View>

        <Input
          secured
          label="Current Password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />

        <Input
          secured
          label="New Password"
          placeholder="New Password"
          value={newPassword}
          onChange={setNewPassword}
          error={Object.keys(passwordErrors).length > 0}
          errorMessage="Passwords must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
        />

        <Input
          secured
          label="Confirm New Password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={setConfirmNewPassword}
          error={
            confirmNewPassword.length > 8 && newPassword !== confirmNewPassword
          }
          errorMessage="Passwords must match!"
        />
      </CollapsableSection>
    </SafeAreaView>
  );
}
