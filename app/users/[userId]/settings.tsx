import Button from "@/components/ui/button/button";
import Checkbox from "@/components/ui/checkbox/checkbox";
import CollapsableSection from "@/components/ui/collapsable-section/collapsable-section";
import Divider from "@/components/ui/divider/divider";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Text from "@/components/ui/text/text";
import { EmailMask } from "@/constants/masks/text-masks";
import { SortType, SortTypes } from "@/constants/sorting";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import ToastContext from "@/contexts/ui/toast.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import {
  getLocalStorageUserPreferences,
  setLocalStorageUserPreferences,
} from "@/functions/local-storage/user-preferences-local-storage";
import { titleCase } from "@/functions/text-manipulation";
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
import { faBorderAll, faList } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import { SafeAreaView, View } from "react-native";

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
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<View>(null);

  if (user?.id !== userPageUser?.id) {
    router.push(`users/${userPageUser?.id}`);
    return null;
  }

  const [preferencesOpen, setPreferencesOpen] = React.useState(false);
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);

  const [decksSort, setDecksSort] = React.useState(
    preferences?.decksSortType ?? (DeckSortTypes.CREATED as DeckSortType)
  );
  const [decksView, setDecksView] = React.useState(
    preferences?.decksViewType ?? (DeckViewType.CARD as DeckViewType)
  );

  const [deckCardViewType, setDeckCardViewType] = React.useState(
    preferences?.deckCardViewType ?? DeckCardGalleryViewTypes.LIST
  );
  const [deckCardGrouping, setDeckCardGrouping] = React.useState(
    preferences?.deckCardGrouping ?? DeckCardGalleryGroupTypes.TYPE
  );
  const [deckCardSortType, setDeckCardSortType] = React.useState(
    preferences?.deckCardSortType ?? DeckCardGallerySortTypes.NAME
  );
  const [deckCardSortDirection, setDeckCardSortDirection] = React.useState(
    preferences?.deckCardSortDirection ?? (SortTypes.ASC as SortType)
  );
  const [deckCardColumnShowPrice, setDeckCardColumnShowPrice] = React.useState(
    preferences?.deckCardColumnShowPrice ?? false
  );
  const [deckCardColumnShowManaValue, setDeckCardColumnShowManaValue] =
    React.useState(preferences?.deckCardColumnShowManaValue ?? true);
  const [deckCardColumnGroupMulticolored, setDeckCardColumnGroupMulticolored] =
    React.useState(preferences?.deckCardColumnGroupMulticolored ?? false);

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

  function logout() {
    UserService.logout().then(() => {
      router.push("");
      setUser(user ? { ...user, name: "" } : null);

      addToast({
        action: "info",
        title: "Logged Out!",
        subtitle: "You have successfully been logged out",
      });
    });
  }

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View
        ref={containerRef}
        className="z-10"
        onLayout={() =>
          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBodyHeight(height)
          )
        }
      >
        <CollapsableSection
          title="Preferences"
          expanded={preferencesOpen}
          setExpanded={setPreferencesOpen}
        >
          <Text size="lg" thickness="bold">
            Decks Page
          </Text>

          <Divider thick className="!border-background-200" />

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
              <Text size="md" thickness="bold">
                Default Decks View
              </Text>

              <View className="flex flex-row">
                <Button
                  squareRight
                  icon={faBorderAll}
                  className="flex-1"
                  type={
                    decksView === DeckViewType.CARD ? "default" : "outlined"
                  }
                  onClick={() => updateDecksViewType(DeckViewType.CARD)}
                />

                <Button
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

          <Text size="lg" thickness="bold" className="mt-4">
            Deck Page
          </Text>

          <Divider thick className="!border-background-200" />

          <View className="flex flex-row flex-wrap gap-4">
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

            <View className="flex flex-row">
              <Select
                squareRight
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
                squareLeft
                label="Direction"
                className="mr-4 max-w-min"
                value={deckCardSortDirection}
                onChange={updateDeckCardSortDirection}
                options={[
                  { label: "Ascending", value: SortTypes.ASC },
                  { label: "Descending", value: SortTypes.DESC },
                ]}
              />
            </View>

            <View className="flex-1 flex gap-2 max-h-fit min-w-fit z-[-1]">
              <Text size="md" thickness="bold">
                Default Column Options
              </Text>

              <View className="flex flex-row gap-4 my-2 max-w-fit">
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
      </View>

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

      {user.id === userPageUser?.id && (
        <View className="flex flex-row justify-end m-4">
          <Button
            text="Logout"
            action="danger"
            type="clear"
            onClick={() => logout()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
