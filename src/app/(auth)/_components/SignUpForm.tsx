"use client";

import { useFormState } from "react-dom";
import { AuthState, signUp } from "../_actions/auth";
import UserForm from "./UserForm";

export function SignUpForm() {
   const [state, action] = useFormState<AuthState, FormData>(signUp, {});

   return <UserForm state={state} action={action} />;
}
