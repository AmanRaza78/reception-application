import { createVisitor, type State } from "@/action";
import SubmitButton from "./submit-button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";
import { toast } from "sonner";
import { useFormState } from "react-dom";

export default function CreateVisitorForm() {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(createVisitor, initalState);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state?.message);
    } else if (state?.status === "error") {
      toast.error(state?.message);
    }
  }, [state]);
  return (
    <form action={formAction}>
      <CardHeader>
        <CardTitle>
          Welcome
          <span className="text-xl tracking-tighter text-primary">
            Jobox Hire
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="title">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Name of the Visitor"
            minLength={3}
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="smalldescription">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="Email of the Visitor"
            minLength={3}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="smalldescription">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            placeholder="Phone Number"
            minLength={3}
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="tomeet">To Meet</Label>
          <Input
            id="tomeet"
            name="tomeet"
            type="text"
            placeholder="Person you are visiting to.."
            minLength={1}
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            minLength={3}
            maxLength={255}
            placeholder="Please enter your address"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="smalldescription">Purpose</Label>
          <Input
            id="purpose"
            name="purpose"
            type="text"
            placeholder="Purpose of Visiting"
            minLength={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton title="Check-In" />
      </CardFooter>
    </form>
  );
}
