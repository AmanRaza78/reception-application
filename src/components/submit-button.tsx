"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

interface SubmitButtonProps {
  title: string
}

export default function SubmitButton({title}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>Please Wait....</Button>
      ) : (
        <Button type="submit">{title}</Button>
      )}
    </>
  );
}
