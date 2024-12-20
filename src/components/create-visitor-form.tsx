"use client"
import { createVisitor, type State } from "@/action";
import SubmitButton from "./submit-button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { revalidateCheckout } from "@/lib/revalidate-checkout";

export default function CreateVisitorForm() {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(createVisitor, initalState);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state?.message);
      revalidateCheckout()
    } else if (state?.status === "error") {
      toast.error(state?.message);
    }
  }, [state]);
  return (
    <form action={formAction}>
      <CardHeader>
        <CardTitle>
          Welcome To <span className="text-xl tracking-tighter text-primary">Jobox Hire</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name" className="text-xl">Your Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Please Enter Your Name"
            className="p-6"
            minLength={3}
          />
          {state?.errors?.["name"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["name"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="email" className="text-xl">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="Please Enter Your Email"
            className="p-6"
            required={false}
          />
          {state?.errors?.["email"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["email"]?.[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="phone" className="text-xl">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            placeholder="Please Enter your Phone Number"
            className="p-6"
            minLength={3}
            maxLength={10}
          />
          {state?.errors?.["phone"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["phone"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="tomeet" className="text-xl">To Meet</Label>
          <Input
            id="tomeet"
            name="tomeet"
            type="text"
            placeholder="Person you are visiting to.."
            className="p-6"
            minLength={1}
          />
          {state?.errors?.["tomeet"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["tomeet"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="address" className="text-xl">Your Address</Label>
          <Textarea
            id="address"
            name="address"
            minLength={3}
            maxLength={255}
            placeholder="Please enter your address"
          />
          {state?.errors?.["address"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["address"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="purpose" className="text-xl">Purpose</Label>
          <Input
            id="purpose"
            name="purpose"
            type="text"
            placeholder="Purpose of Visiting"
            className="p-6"
            minLength={3}
          />
          {state?.errors?.["purpose"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["purpose"]?.[0]}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton title="Check-In" />
      </CardFooter>
    </form>
  );
}
