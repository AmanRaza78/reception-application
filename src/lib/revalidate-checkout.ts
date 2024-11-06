"use server"
import { revalidatePath } from "next/cache"

export async function revalidateCheckout(){
    "use server"
    revalidatePath("visitors")
  }