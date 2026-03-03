"use client";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSchema } from "@/lib/schema";

export default function Login() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormSchema>();

  const onSubmit = (data: FormSchema) => {
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          router.push("/calculator");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred");
      });
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

        <Button type="submit">Log In</Button>

        <a className={styles.a} href="/auth/signup">
          Don't have an account? Sign Up
        </a>
      </form>
    </div>
  );
}
