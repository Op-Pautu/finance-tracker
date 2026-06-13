"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signInAction, signUpAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "sign-in" | "sign-up";

function SubmitButton({ mode }: { mode: Mode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {mode === "sign-in" ? "Sign in" : "Create account"}
    </Button>
  );
}

export function AuthForm({ mode, next }: { mode: Mode; next?: string }) {
  const action = mode === "sign-in" ? signInAction : signUpAction;
  const [state, formAction] = useActionState<AuthState, FormData>(action, null);

  const error = state && "error" in state ? state.error : null;
  const notice = state && "notice" in state ? state.notice : null;

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      {mode === "sign-up" && (
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "sign-up" && (
            <span className="text-xs text-muted-foreground">min 8 chars</span>
          )}
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <p className="rounded-md bg-expense-muted px-3 py-2 text-sm text-expense">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
          {notice}
        </p>
      )}

      <SubmitButton mode={mode} />

      <p className="text-center text-sm text-muted-foreground">
        {mode === "sign-in" ? (
          <>
            New here?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
