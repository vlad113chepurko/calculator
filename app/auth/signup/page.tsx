"use client";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginSchema = {
  email: string;
  password: string;
};

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { control, handleSubmit } = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    setLoading(true);
    try {
      fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (
            !res.ok &&
            res.headers.get("content-type")?.includes("text/html")
          ) {
            throw new Error(
              `Server returned ${res.status}: route not found or server error`,
            );
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert("User created! Token: " + data.token);
            router.push("/auth/login");
          }
        });
    } catch (err) {
      alert("Error connecting to service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input {...field} type="password" />}
          />
        </Field>

        <Button type="submit">{loading ? <Spinner /> : "Sign Up"}</Button>

        <a className={styles.a} href="/auth/login">
          Already have an account? Log In
        </a>
      </form>
    </div>
  );
}
