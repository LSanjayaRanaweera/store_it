"use client"; // ONLY implemented in backend/SERVER

import { z } from "zod";
// 2. Inserted Two imports from "Define a form" -------------------------------------------------------------
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// 4.A Insert the following required 'imports" from "Build your form"------------------------------------------
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import Image from "next/image"; // import the optimized Image component from Next.js
import Link from "next/link"; // imports Link component from Next.js, used in client side navigation (routes)
import { createAccount } from "@/lib/actions/user.actions";
import OtpModal from "@/components/OTPModal";

/* const formSchema = z.object({
  username: z.string().min(2).max(50),
});
1. The code above is cut and pasted from shadcns' "create a form schema" section-----------------------------
It is later replaced by the new callback == authFormSchema(), i.e., implemented below
NOTE: The invoked authFormSchema() is assigned to the variable formSchema within AuthForm mimicking the desired implementation
of previous formSchema callback << It let us continue with the same variable implemented in onSubmit() but would have a deep
evaluatory logic than what was supplied originally     */

type FormType = "sign-in" | "sign-up";
// NOTE: "type" is a TypeScript keyword that define the shape and constraints of data
// "type" is implemented when creating CUSTOM types that describe objects. primitives, unions, functions etc.

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  // Creating a loading state with useState
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type); // calling authFormSchema()
  // 3. Inserted Two callbacks---------------------------------------------------------------------------------
  // A. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = await createAccount({
        fullName: values.fullName || "",
        email: values.email,
      });

      setAccountId(user.accountId);
    } catch {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // After setting up shadcn, implement the return statement
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          {/* button is disabled if isLoading is true */}
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account"
                : "Already have an account"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {/* Clickable links displayed */}
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      {/* OTP Verification */}

      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};
export default AuthForm;

/* SHADCN --INSTALLATION
The starter code had provided necessary dependencies.
Otherwise, it would require to npx intall commands,
    $ npx shadcn@latest init
    $ npx shadcn@latest add form
NOTE: This would NOT add a node module to the list. It will only add 3 dependencies that have no 'shadcn' in the name,
  "@hookform/resolvers": "^3.10.0",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-slot": "^1.2.3",
NOTE: This would add a new 'ui' folder to components folder. The 'ui' would have THREE (3) new files.
  1. button.tsx   2. form.tsx   3. label.tsx
----------------------------------------------------------------------------------------------------------------------
  SHADCN --IMPLEMENTATION (the order of shadcn implementation is numbered. Each insertion corresponds to the number in the code
1. Copy and past from --   "create a form schema" section
2. Copy and past from --   "Define a form" section
  The TWO imports { zodResolver } and { useForm } are inserted below "use Client" and above import { z }
3. Copy and pasted TWO callback functions from "ProfileForm" >> A. form()  and B. onSubmit() handler (requires logic)
4. A. Copy and paste rest of the imports from -- "Build your form" section
   B. Copy and paste the entire return from that section
-------------------------------------------------------------------------------------------------------------------------
Return statement modifications
h1 -dynamically controlled by type={}
2 self-closing form fields for fullName (dynamic) and email
button -dynamically controlled spin motion (by isLoading), inner text (by type),
div - dynamic message and corresponding link
------------------------------------------------------------------------------------------------------------------------
Creating authFormSchema() & calling it in AuthForm()
NOTE: formSchema() callback was brought in from shadcn in step 1.
A custom authFormSchema() was created to replace it (commented out after)
However to leave existing formSchema() implementation intact, authFormSchema() was invoked inside the AuthForm and
assigned to formSchema variable preserving the implementation.
*/
