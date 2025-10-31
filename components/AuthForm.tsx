"use client";

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

import { z } from "zod";
import { useState } from "react";
import Image from "next/image"; // import the optimized Image component from Next.js
import Link from "next/link"; // imports Link component from Next.js, used in client side navigation

const formSchema = z.object({
  username: z.string().min(2).max(50),
});
// 1. The code above is cut and paste from shadcn >> from "create a form schema" section---------------------

type FormType = "sign-in" | "sign-up";
// NOTE: "type" is a TypeScript keyword that define the shape and constraints of data
// "type" is implemented when creating CUSTOM types that describe objects. primitives, unions, functions etc.

const AuthForm = ({ type }: { type: FormType }) => {
  // Creating a loading state with useState
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 3. Inserted Two callbacks---------------------------------------------------------------------------------
  // A. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // B. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
  SHADCN --IMPLEMENTATION (the order of implementation is numbered and their insert location corresponds to the numebr in the code)
1. Copy and past from --   "create a form schema" section
2. Copy and past from --   "Define a form" section
  The TWO imports { zodResolver } and { useForm } are inserted below "use Client" and above import { z }
3. Copy and pasted TWO callback functions from "ProfileForm" >> A. form()  and B. onSubmit() handler (requires logic)
4. A. Copy and paste rest of the imports from -- "Build your form" section
   B. Copy and paste the entire return from that section
*/
