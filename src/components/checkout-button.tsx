"use client";
import { useFormState} from "react-dom";
import { Button } from "./ui/button";
import { State, updateCheckOut } from "@/action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { revalidateCheckout } from "@/lib/revalidate-checkout";
import SubmitButton from "./submit-button";

interface CheckOutButtonProps {
  itemId: string;
}

export default function CheckoutButton({ itemId }: CheckOutButtonProps) {

    const initalState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(updateCheckOut, initalState);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        if (state?.status === "success") {
          toast.success(state?.message);
          setCheckout(true);
          revalidateCheckout()
        } else if (state?.status === "error") {
          toast.error(state?.message);
        }
      }, [state]);
  return (
    <form action={formAction}>
      <input type="hidden" name="visitorId" value={itemId} />
      {
        checkout ? (
          <Button disabled>Checked-Out</Button>
        ) : (
            <SubmitButton title="Check-Out"/>
        )
      }
  
    </form>
  );
}
