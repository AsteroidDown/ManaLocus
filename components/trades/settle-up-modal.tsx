import ToastContext from "@/contexts/ui/toast.context";
import { currency } from "@/functions/text-manipulation";
import TradeService from "@/hooks/services/trade.service";
import { User } from "@/models/user/user";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

export interface SettleUpModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  total: number;
  user: User;
  tradedToUser: User;

  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function SettleUpModal({
  open,
  setOpen,
  total,
  user,
  tradedToUser,
  setPage,
}: SettleUpModalProps) {
  const { addToast } = useContext(ToastContext);

  const [loading, setLoading] = React.useState(false);

  const owing = total < 0;

  function settleUp() {
    setLoading(true);

    if (owing) {
      TradeService.create(user.id, {
        tradingUserId: user.id,
        tradedToUserId: tradedToUser.id,
        tradingUserTotal: total,
        tradedToUserTotal: 0,
        total: total * -1,
        tradingUserCards: [
          {
            count: 1,
            foil: false,
            price: total * -1,
            userId: user.id,
            name: `Settle Up with ${tradedToUser.name}`,
          },
        ],
      }).then(() => {
        setOpen(false);
        setLoading(false);
        setPage(1);

        addToast({
          action: "success",
          title: "Settled Up!",
          subtitle: `You and ${tradedToUser.name} are now settled up.`,
        });
      });
    } else {
      TradeService.create(user.id, {
        tradingUserId: user.id,
        tradedToUserId: tradedToUser.id,
        tradingUserTotal: 0,
        tradedToUserTotal: total,
        total: total * -1,
        tradedToUserCards: [
          {
            count: 1,
            foil: false,
            price: total,
            userId: tradedToUser.id,
            name: `Settle Up with ${user.name}`,
          },
        ],
      }).then(() => {
        setOpen(false);
        setLoading(false);
        setPage(1);

        addToast({
          action: "success",
          title: "Settled Up!",
          subtitle: `You and ${tradedToUser.name} are now settled up.`,
        });
      });
    }
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={`Settle Up with ${tradedToUser?.name}?`}
      footer={
        <View className="flex flex-row gap-2 justify-end">
          <Button
            size="sm"
            type="outlined"
            text="Cancel"
            onClick={() => setOpen(false)}
          />

          <Button
            size="sm"
            type="outlined"
            text="Settle Up"
            icon={faReceipt}
            disabled={loading}
            onClick={settleUp}
          />
        </View>
      }
    >
      <Text className="max-w-[500px] mt-2">
        {owing ? "You owe" : `${tradedToUser.name} owes`}{" "}
        {owing ? `${tradedToUser.name}` : "you"}{" "}
        <Text action={owing ? "danger" : "success"}>
          {currency(Math.abs(total) / 100)}
        </Text>
        , would you like to settle up this difference? This action will create a
        trade with the amount{" "}
        {owing ? "you owe" : `${tradedToUser.name} owes you`}.
      </Text>
    </Modal>
  );
}
