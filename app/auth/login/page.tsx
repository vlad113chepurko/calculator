"use client";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSchema } from "@/lib/schema";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormSchema>();

  const onSubmit = (data: FormSchema) => {
    setLoading(true);
    try {
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
            const { token } = data;
            localStorage.setItem("token", token);
            router.push("/calculator");
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

        <Button type="submit">{loading ? <Spinner /> : "Log In"}</Button>

        <a className={styles.a} href="/auth/signup">
          Don't have an account? Sign Up
        </a>
      </form>
    </div>
  );
}
