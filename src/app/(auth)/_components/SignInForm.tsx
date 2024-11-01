"use client";

import { useFormState } from "react-dom";
import { AuthState, signIn } from "../_actions/auth";
import UserForm from "./UserForm";

export function SignInForm() {
   const [state, action] = useFormState<AuthState, FormData>(signIn, {});

   return <UserForm state={state} action={action} />;
}
