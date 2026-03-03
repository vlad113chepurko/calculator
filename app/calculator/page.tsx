"use client";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import styles from "../Home.module.css";

export default function Calculator() {
  const [loading, setLoading] = useState(false);
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | number>("");

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/calc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expression }),
      });

      const data = await res.json();
      if (data.error) {
        setResult(data.error);
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setResult("Error connecting to service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <h1>Calculator</h1>
      <div className={styles.calculator}>
        <Input
          type="text"
          placeholder="Enter expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
        <Button onClick={handleCalculate} variant="outline">
          Calculate
        </Button>
        {loading ? (
          <Spinner />
        ) : (
          <div className={styles.result}>{result || "No result yet"}</div>
        )}
      </div>
    </div>
  );
}
