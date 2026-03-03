"use client";
import styles from "./Home.module.css";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <main className={styles.main}>
      <h1 className="text-2xl font-bold text-center">
        Welcome to the Calculator App
      </h1>
      <p className="text-center">
        Please sign up or log in to use the calculator.
      </p>
      <div className="flex flex-row gap-5">
        <Button
          onClick={() => router.push("/auth/signup")}
          variant="outline"
          className="w-20"
        >
          Sign Up
        </Button>
        <Button
          onClick={() => router.push("/auth/login")}
          variant="outline"
          className="w-20"
        >
          Log In
        </Button>
      </div>
    </main>
  );
}
