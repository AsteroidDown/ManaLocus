import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Checkbox from "@/components/ui/checkbox/checkbox";
import CollapsableSection from "@/components/ui/collapsable-section/collapsable-section";
import Divider from "@/components/ui/divider/divider";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import { EmailType } from "@/constants/emails";
import { Environment } from "@/constants/environment";
import { EmailMask } from "@/constants/masks/text-masks";
import { SortType, SortTypes } from "@/constants/sorting";
import {
  PreferenceColor,
  PreferenceColorHues,
  PreferenceColorMap,
} from "@/constants/ui/colors";
import ToastContext from "@/contexts/ui/toast.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { encode } from "@/functions/encoding";
import { updateLocalStorageUser } from "@/functions/local-storage/user-local-storage";
import {
  getLocalStorageUserPreferences,
  removeLocalStorageUserPreferences,
  setLocalStorageUserPreferences,
} from "@/functions/local-storage/user-preferences-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import EmailService from "@/hooks/services/email.service";
import UserService from "@/hooks/services/user.service";
import {
  DeckCardGalleryGroupTypes,
  DeckCardGallerySortTypes,
  DeckCardGalleryViewTypes,
} from "@/models/deck/deck-gallery-filters";
import {
  DeckSortType,
  DeckSortTypes,
  DeckViewType,
} from "@/models/deck/dtos/deck-filters.dto";
import {
  faBorderAll,
  faEnvelope,
  faList,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";

interface PasswordErrors {
  lowercase?: boolean;
  uppercase?: boolean;
  number?: boolean;
  special?: boolean;
}

export default function UserSettingsPage() {
  const { addToast } = useContext(ToastContext);
  const { user, setUser } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  const { preferences, setPreferences } = useContext(UserPreferencesContext);

  if (user?.id !== userPageUser?.id) {
    router.push(`users/${userPageUser?.name}`);
    return null;
  }

  const [colorKey, setColorKey] = useState(
    preferences?.color ?? PreferenceColor.DEFAULT
  );

  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [decksSort, setDecksSort] = useState(
    preferences?.decksSortType ?? (DeckSortTypes.CREATED as DeckSortType)
  );
  const [decksView, setDecksView] = useState(
    preferences?.decksViewType ?? (DeckViewType.CARD as DeckViewType)
  );

  const [deckCardViewType, setDeckCardViewType] = useState(
    preferences?.deckCardViewType ?? DeckCardGalleryViewTypes.LIST
  );
  const [deckCardGrouping, setDeckCardGrouping] = useState(
    preferences?.deckCardGrouping ?? DeckCardGalleryGroupTypes.TYPE
  );
  const [deckCardSortType, setDeckCardSortType] = useState(
    preferences?.deckCardSortType ?? DeckCardGallerySortTypes.NAME
  );
  const [deckCardSortDirection, setDeckCardSortDirection] = useState(
    preferences?.deckCardSortDirection ?? (SortTypes.ASC as SortType)
  );
  const [deckCardColumnShowPrice, setDeckCardColumnShowPrice] = useState(
    preferences?.deckCardColumnShowPrice ?? false
  );
  const [deckCardColumnShowManaValue, setDeckCardColumnShowManaValue] =
    useState(preferences?.deckCardColumnShowManaValue ?? true);
  const [deckCardColumnGroupMulticolored, setDeckCardColumnGroupMulticolored] =
    useState(preferences?.deckCardColumnGroupMulticolored ?? false);

  const [username, setUsername] = useState(user?.name ?? "");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({} as PasswordErrors);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (!user) return null;

  useEffect(() => {
    if (!preferences) {
      setPreferences(getLocalStorageUserPreferences() || {});
      return;
    }

    if (!colorKey || colorKey === preferences?.color) return;

    Object.values(PreferenceColorHues).forEach((hue) => {
      document.documentElement.style.setProperty(
        `--${hue}`,
        PreferenceColorMap[colorKey][hue]
      );
    });

    if (preferences.color) {
      addToast({
        title: `Color set to ${titleCase(colorKey)}!`,
      });
    }

    setLocalStorageUserPreferences({ color: colorKey });
    setPreferences(getLocalStorageUserPreferences() || {});
  }, [colorKey, preferences]);

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

  useEffect(() => {
    setDecksSort(preferences?.decksSortType || DeckSortTypes.CREATED);
  }, [preferences]);

  function updateDecksSort(sort: DeckSortType) {
    if (decksSort === sort) return;

    setLocalStorageUserPreferences({ decksSortType: sort });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDecksSort(sort);
  }

  function updateDecksViewType(view: DeckViewType) {
    if (decksView === view) return;

    setLocalStorageUserPreferences({ decksViewType: view });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDecksView(view);
  }

  function updateDeckCardViewType(view: DeckCardGalleryViewTypes) {
    if (deckCardViewType === view) return;

    setLocalStorageUserPreferences({ deckCardViewType: view });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDeckCardViewType(view);
  }

  function updateDeckCardGrouping(grouping: DeckCardGalleryGroupTypes) {
    if (deckCardGrouping === grouping) return;

    setLocalStorageUserPreferences({ deckCardGrouping: grouping });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDeckCardGrouping(grouping);
  }

  function updateDeckCardSortType(sort: DeckCardGallerySortTypes) {
    if (deckCardSortType === sort) return;

    setLocalStorageUserPreferences({ deckCardSortType: sort });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDeckCardSortType(sort);
  }

  function updateDeckCardSortDirection(direction: SortType) {
    if (deckCardSortDirection === direction) return;

    setLocalStorageUserPreferences({ deckCardSortDirection: direction });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDeckCardSortDirection(direction);
  }

  function updateDeckCardColumnShowPrice(show: boolean) {
    if (deckCardColumnShowPrice === show) return;

    setLocalStorageUserPreferences({ deckCardColumnShowPrice: show });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDeckCardColumnShowPrice(show);
  }

  function updateDeckCardColumnShowManaValue(show: boolean) {
    if (deckCardColumnShowManaValue === show) return;

    setLocalStorageUserPreferences({ deckCardColumnShowManaValue: show });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDeckCardColumnShowManaValue(show);
  }

  function updateDeckCardColumnGroupMulticolored(group: boolean) {
    if (deckCardColumnGroupMulticolored === group) return;

    setLocalStorageUserPreferences({ deckCardColumnGroupMulticolored: group });
    setPreferences(getLocalStorageUserPreferences() || {});
    setDeckCardColumnGroupMulticolored(group);
  }

  function verify() {
    if (!user) return;
    setVerifying(true);

    EmailService.send<EmailType.VERIFY>(
      EmailType.VERIFY,
      user.email,
      "Verify Your Account",
      {
        username: user.name,
        link: `${Environment.BASE_URL}/verify?token=${encode(
          user.name,
          Environment.VERIFICATION_SECRET as any
        )}`,
      }
    ).then(() => {
      setVerifying(false);
      addToast({
        action: "success",
        title: "Verification Email Sent!",
        subtitle: "Check your email for a verification link",
      });
    });
  }

  function updateUsername() {
    if (!user || !username) return;

    setLoading(true);

    UserService.update(user.id, { name: username }).then((response) => {
      setLoading(false);

      if (!response) {
        addToast({
          duration: 5000,
          action: "danger",
          title: "Error Updating Username!",
          subtitle: "Name already in use",
        });
        return;
      }

      setEmailError(false);
      setUser({ ...user, name: username });
      updateLocalStorageUser({ ...user, name: username });
      addToast({
        action: "success",
        title: "Username Updated!",
        subtitle: `Hello, ${username}!`,
      });
    });
  }

  function updateEmail() {
    if (!user || !email || emailError) return;

    setLoading(true);

    UserService.update(user.id, { email }).then((response) => {
      setLoading(false);

      if (!response) {
        addToast({
          duration: 5000,
          action: "danger",
          title: "Error Updating Email!",
          subtitle: "Email already in use",
        });
        return;
      }

      setEmailError(false);
      setUser({ ...user, email });
      updateLocalStorageUser({ ...user, email });
      addToast({
        action: "success",
        title: "Email Updated!",
        subtitle: "Your email has been updated",
      });
    });
  }

  function updatePassword() {
    if (!user || !newPassword || Object.values(passwordErrors)?.length) return;

    setLoading(true);

    UserService.update(user.id, { password: newPassword }).then((response) => {
      setLoading(false);

      if (!response) {
        addToast({
          duration: 5000,
          action: "danger",
          title: "Error Updating Password!",
        });
        return;
      }

      setPasswordErrors({});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      updateLocalStorageUser(user, newPassword);
      addToast({
        action: "success",
        title: "Password Updated!",
        subtitle: "Your password has been updated",
      });
    });
  }

  function logout() {
    UserService.logout().then(() => {
      router.push("");
      setPreferences(null);
      removeLocalStorageUserPreferences();
      setUser(user ? { ...user, name: "" } : null);

      addToast({
        action: "info",
        title: "Logged Out!",
        subtitle: "You have successfully been logged out",
      });
    });
  }

  return (
    <SafeAreaView>
      <View className="flex-1 flex gap-4 lg:px-16 px-4 w-full h-full min-h-[100dvh] py-4 bg-background-100">
        <BoxHeader
          title="Settings"
          subtitle="Manage your account preferences and settings"
        />

        <CollapsableSection
          title="Preferences"
          expanded={preferencesOpen}
          setExpanded={setPreferencesOpen}
        >
          <Text size="md" weight="bold">
            Color
          </Text>

          <Divider thick />

          <View className="flex flex-row flex-wrap gap-4 mt-2">
            {Object.values(PreferenceColor).map((key) => (
              <Pressable
                key={key}
                className="hover:w-12 w-10 hover:h-12 h-10 hover:-m-1 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: `rgb(${PreferenceColorMap[key]["primary-200"]})`,
                }}
                onPress={() => setColorKey(key)}
              />
            ))}
          </View>

          <Text size="md" weight="bold" className="mt-4">
            Decks Page
          </Text>

          <Divider thick />

          <View className="flex flex-row flex-wrap gap-4 z-10">
            <Select
              className="max-w-min"
              label="Default Decks Sorting"
              value={decksSort}
              onChange={updateDecksSort}
              options={[
                { label: "Created", value: DeckSortTypes.CREATED },
                {
                  label: "Created (Old to New)",
                  value: DeckSortTypes.CREATED_REVERSE,
                },
                { label: "Updated", value: DeckSortTypes.UPDATED },
                {
                  label: "Updated (Old to New)",
                  value: DeckSortTypes.UPDATED_REVERSE,
                },
                { label: "Favorites", value: DeckSortTypes.FAVORITES },
                {
                  label: "Favorites (Ascending)",
                  value: DeckSortTypes.FAVORITES_REVERSE,
                },
                { label: "Views", value: DeckSortTypes.VIEWS },
                {
                  label: "Views (Ascending)",
                  value: DeckSortTypes.VIEWS_REVERSE,
                },
              ]}
            />

            <View className={`flex gap-2 max-h-fit min-w-fit z-[-1]`}>
              <Text weight="semi">Default Decks View</Text>

              <View className="flex flex-row">
                <Button
                  size="sm"
                  squareRight
                  icon={faBorderAll}
                  className="flex-1"
                  type={
                    decksView === DeckViewType.CARD ? "default" : "outlined"
                  }
                  onClick={() => updateDecksViewType(DeckViewType.CARD)}
                />

                <Button
                  size="sm"
                  squareLeft
                  icon={faList}
                  className="flex-1"
                  type={
                    decksView === DeckViewType.LIST ? "default" : "outlined"
                  }
                  onClick={() => updateDecksViewType(DeckViewType.LIST)}
                />
              </View>
            </View>
          </View>

          <Text size="md" weight="bold" className="mt-4">
            Deck Page
          </Text>

          <Divider thick />

          <View className="flex flex-row flex-wrap gap-4 max-w-full">
            <Select
              label="Default View"
              className="max-w-min"
              value={deckCardViewType}
              onChange={updateDeckCardViewType}
              options={Object.keys(DeckCardGalleryViewTypes).map((key) => {
                return {
                  label: titleCase(key),
                  value: (DeckCardGalleryViewTypes as any)[key],
                };
              })}
            />

            <Select
              className="max-w-min"
              label="Default Grouping"
              value={deckCardGrouping}
              onChange={updateDeckCardGrouping}
              options={Object.keys(DeckCardGalleryGroupTypes).map((key) => {
                return {
                  label: titleCase(key.replace("_", " ")),
                  value: (DeckCardGalleryGroupTypes as any)[key],
                };
              })}
            />

            <Select
              className="max-w-min"
              label="Default Card Sorting"
              value={deckCardSortType}
              onChange={updateDeckCardSortType}
              options={Object.values(DeckCardGallerySortTypes).map((key) => ({
                label: titleCase(key.replace("-", " ")),
                value: key,
              }))}
            />

            <Select
              label="Card Sort Direction"
              className="mr-4 max-w-min"
              value={deckCardSortDirection}
              onChange={updateDeckCardSortDirection}
              options={[
                { label: "Ascending", value: SortTypes.ASC },
                { label: "Descending", value: SortTypes.DESC },
              ]}
            />

            <View className="flex-1 flex gap-1 max-h-fit min-w-fit z-[-1]">
              <Text weight="semi">Default Column Options</Text>

              <View className="flex flex-row flex-wrap gap-4 my-2 max-w-fit">
                <Checkbox
                  label="Show Price"
                  checked={deckCardColumnShowPrice}
                  onChange={updateDeckCardColumnShowPrice}
                />

                <Checkbox
                  label="Show Mana Value"
                  checked={deckCardColumnShowManaValue}
                  onChange={updateDeckCardColumnShowManaValue}
                />

                <Checkbox
                  label="Separate by Color"
                  checked={deckCardColumnGroupMulticolored}
                  onChange={updateDeckCardColumnGroupMulticolored}
                />
              </View>
            </View>
          </View>
        </CollapsableSection>

        <CollapsableSection
          title="Account Details"
          expanded={detailsOpen}
          setExpanded={setDetailsOpen}
        >
          {!user.verified && (
            <>
              <Text size="md" weight="bold">
                Verification
              </Text>

              <Divider thick />

              <Button
                size="sm"
                type="outlined"
                disabled={verifying}
                text="Resend Verification Email"
                className="mb-4 max-w-fit"
                icon={verifying ? faRotate : faEnvelope}
                onClick={verify}
              />
            </>
          )}

          <View className="flex flex-row justify-between">
            <Text size="md" weight="bold" className="self-end">
              Username
            </Text>

            <Button
              size="sm"
              type="clear"
              text="Update"
              className="-mb-1"
              disabled={loading || user.name === username}
              onClick={updateUsername}
            />
          </View>

          <Divider thick />

          <Input value={username} onChange={setUsername} />

          <View className="flex flex-row justify-between mt-4">
            <Text size="md" weight="bold" className="self-end">
              Email
            </Text>

            <Button
              size="sm"
              type="clear"
              text="Update"
              className="-mb-1"
              disabled={
                loading ||
                user.email === email ||
                !email.match(EmailMask) ||
                !email.includes("@") ||
                !email.includes(".") ||
                emailError
              }
              onClick={updateEmail}
            />
          </View>

          <Divider thick />

          <Input
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

          <View className="flex flex-row justify-between mt-4">
            <Text size="md" weight="bold" className="self-end">
              Password
            </Text>

            <Button
              size="sm"
              type="clear"
              text="Update"
              className="-mb-1"
              disabled={
                loading ||
                Object.keys(passwordErrors).length > 0 ||
                newPassword.length < 8 ||
                newPassword !== confirmNewPassword
              }
              onClick={updatePassword}
            />
          </View>

          <Divider thick />

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
              confirmNewPassword.length > 8 &&
              newPassword !== confirmNewPassword
            }
            errorMessage="Passwords must match!"
          />
        </CollapsableSection>

        {user.id === userPageUser?.id && (
          <View className="flex flex-row justify-end">
            <Button
              text="Logout"
              action="danger"
              type="outlined"
              onClick={() => logout()}
            />
          </View>
        )}
      </View>

      <Footer />
    </SafeAreaView>
  );
}
